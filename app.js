
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')
var mongoose = require('mongoose');

// Connect to the Mongo database, whether locally or on Heroku
var local_database_uri = 'mongodb://caritydb:Carity%69!@ds019648.mlab.com:19648/heroku_g8zckv7m';
var database_uri = process.env.MONGOLAB_URI || local_database_uri;
mongoose.connect(database_uri);

//Main Tabs
var index 			= require('./routes/index');
var saved_causes 	= require('./routes/saved_causes');
var charities		= require('./routes/charities');
var achievements	= require('./routes/achievements');
var settings		= require('./routes/settings');

//Login and Signup
var login 			= require('./routes/login');
var createacct      = require('./routes/createacct');

//My History
var history			= require('./routes/history');
var history_detail	= require('./routes/history_detail');

//My Cause Detail
var my_cause_detail	= require('./routes/my_cause_detail');

//Cause Detail
var cause_detail 	= require('./routes/cause_detail');

//Ajax
//add/remove favorite
var charities_add_favorite = require('./routes/toggle_favorite');

//update session variable
var update_session = require('./routes/update_session');

//var add 	= require('./routes/add');
// Example route
// var user = require('./routes/user');

var app = express();

//Register helpers
var hbs = handlebars.create({
    // Specify helpers which are only registered on this instance. 
    helpers: {
        json: function (context) { return JSON.stringify(context); }
    }
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());


//Middleware functions must be written before app.router is set
var models = require('./models');

//app.use(f);

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//Middleware function to require login
requireLogin = function(req, res, next) {
	//console.log("entre");
	//Check if session exists
	if (req.session && req.session.user) {
		//console.log("SESSION: ", req.session.user);
		//Lookup user in the DB using the userID in session
		models.User
			.find({ "_id" : req.session.user._id })
			.populate("my_causes.charity")
			.populate("history.charity")
			.limit(1)
			.exec(function(err, user) {
				if (user && user.length > 0) {
					//console.log("HUHUH " + user[0]);
					//User found. Set req user
					req.user = user[0];
					delete req.user.password; //delete password from session

					//refresh session value with (potentially new) user data
					req.session.user = req.user;

					//Expose user to template
					res.locals.user = req.user;

					//Generate fullData json
					var fullData = {
						"history" : req.user.history,
						"my_causes" : req.user.my_causes
					};

					//Get charities and saved_causes
					//Load Charities
					models.Charity
						.find({
							"enabled" : true
						})
						//.lean() //Causes query to get plain JSON object (modifiable)
						.exec(function(err, charities) {
							if (err) {
								console.log("App: error on loadCharities = ", err);
								//res.send(500);

								delete req.session.user;
								delete req.user;

								//Redirect to login
								res.redirect('/login');
							}
							else {
								//Find favorite and my_cause statuses of charities
								var fullCharities = [];
								var saved_causes = [];
								for (var i=0; i<charities.length; ++i) {
									var charity = {
										"charity" : charities[i]
									}

									//Since req.user.my_causes contains populated charity objects, we map a new array with only the ids
									var charIds = req.user.my_causes.map(function(cause) { return cause.charity._id.toString(); });

									//Check if charity id in charIds
									if ( charIds.indexOf(charity.charity._id.toString()) != -1) {
										//Found charity id in user's my_causes, set as my_cause
										charity['my_cause'] = "1";
									}
									else {
										charity['my_cause'] = "";
									}

									//Check if charity id in user favorites
									if ( req.user.favorites.indexOf(charity.charity._id) != -1) {
										//Found charity id in user's favorites, set as favorite
										charity['favorite'] = "1";

										//Since we have it in favorites, we add it to saved_causes
										saved_causes.push(charity);
									}
									else {
										charity['favorite'] = "";
									}



									// if (charity.charity.name == "Charity 8") {
									// 	//Add my_cause
									// 	var my_cause = {
									// 		"charity"		: charity.charity._id,
									// 		"percentage"	: 25,
									// 		"money_saved"	: 100
									// 	};
									// 	models.User.findByIdAndUpdate(
									// 		req.user._id,
									// 		{$push: {"my_causes" : my_cause}},
									// 		{safe : true},
									// 		function(err, model) {console.log(err);}
									// 	);
									// }

									fullCharities.push(charity);
								}

								// console.log("CHARITIES: ", fullCharities);
								// console.log("SAVEDCAUSES: ", saved_causes);

								
								fullData['charities'] = fullCharities;
								fullData['saved_causes'] = saved_causes;
							}

							//Go through my_causes and add empty json objects if necessary
							var my_causes = [];
							var myCausesLen = req.user.my_causes.length;
							for (var i=0; i < 4; ++i) {
								if (i < myCausesLen) {
									var currCause = req.user.my_causes[i];

									var cause = {
										"_id" : currCause._id,
										"charity" : currCause.charity,
										"finished" : currCause.finished,
										"money_saved" : currCause.money_saved,
										"percentage" : currCause.percentage
									}

									if (cause.percentage == 100) {
										cause['color'] = "success";
									}
									else if (cause.percentage <= 40) {
										cause['color'] = "danger";
									}
									else {
										cause['color'] = "warning";
									}

									//progress-empty is used to set color of progressbar text to black instead of white for visibility
									if (parseInt(cause.percentage) <= 28) {
										cause['progress-empty'] = true;
									}
									else {
										cause['progress-empty'] = false;
									}

									my_causes.push(cause);
								}
								else {
									my_causes.push({
										"color" : "warning",
										"progress-empty" : false
									});
								}
							}
							fullData['my_causes'] = my_causes;

							console.log(fullData);

							//Make session available locally
							res.locals.session = req.session;

							//Add to req
							req.fullData = fullData;

							//Make fullData available locally
							res.locals.fullData = fullData;

							//Finish process of middleware and run the route
							next();
						});
				}
				else {
					delete req.session.user;
					delete req.user;

					//Make session available locally
					res.locals.session = req.session;

					//Finish process of middleware and run the route
					//next();

					//Redirect to login
					res.redirect('/login');
				}
			});
	}
	else {
		//Make session available locally
		res.locals.session = req.session;

		//No session or user in session. Just continue.
		delete req.session.user;
		delete req.user;
		//next();

		//Redirect to login
		res.redirect('/login');
	}
};



// Add routes here

//Alternate Versions
app.get('/homeHistoryOnBottom', requireLogin, index.homeHistoryOnBottom);
app.get('/homeDeleteCause', requireLogin, index.homeDeleteCause);
app.get('/home', requireLogin, index.home); //original

//Main Tabs
app.get('/', requireLogin, index.view);
app.get('/saved_causes', requireLogin, saved_causes.view);
app.get('/charities', requireLogin, charities.view);
app.get('/achievements', requireLogin, achievements.view);
app.get('/settings', requireLogin, settings.view);

//Login and Signup. NOTE: we don't use requireLogin middleware here
app.get('/login', login.view);
app.get('/createacct', createacct.view);

//My History
app.get('/history', requireLogin, history.view);
app.get('/history_detail/:id_cause', requireLogin, history_detail.view);

//My Cause Detail
app.get('/my_cause_detail/:id_cause', requireLogin, my_cause_detail.view);

//Cause Detail
app.get('/cause_detail/:source/:id_cause', requireLogin, cause_detail.view);

//Ajax
app.get('/addMoneyToCause/:source/:id_cause/:amountToAdd', requireLogin, index.addMoneyToCause);
app.get('/donateToCause/:id_cause', requireLogin, index.donateToCause);

app.get('/charities/toggle_favorite', requireLogin, charities_add_favorite.toggleFavorite);
app.get('/charities/add_my_cause', requireLogin, charities.addMyCause);

app.get('/my_cause_detail/:id_cause/:id_saving_amount/:saving_amount', requireLogin, my_cause_detail.updateSavingAmount);
app.get('/my_cause_detail/deleteCause/:id_cause', requireLogin, my_cause_detail.deleteCause);

app.get('/session/update_session', requireLogin, update_session.updateSession);
app.get('/settings/transferToBank', requireLogin, settings.transferToBank);
app.post('/settings/addBankAccount', requireLogin, settings.addBankAccount);
app.get('/settings/deleteBankAccount', requireLogin, settings.deleteBankAccount);

app.post('/createacct/attemptSignUp', createacct.attemptSignUp);

app.post('/login/attemptLogin', login.attemptLogin);

//app.get('/add', add.addFriend);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
