
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

//Main Tabs
var index 			= require('./routes/index');
var saved_causes 	= require('./routes/saved_causes');
var charities		= require('./routes/charities');
var achievements	= require('./routes/achievements');
var settings		= require('./routes/settings');

//Login and Signup
var login 			= require('./routes/login');
var createacct      = require('./routes/createacct');

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
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

localQuery = function(req, res, next) {
  res.locals.session = req.session;
  next();
};



// Add routes here
//Main Tabs
app.get('/', index.view);
app.get('/saved_causes', saved_causes.view);
app.get('/charities', localQuery, charities.view);
app.get('/achievements', achievements.view);
app.get('/settings', settings.view);

//Login and Signup
app.get('/login', login.view);
app.get('/createacct', createacct.view);

//My Cause Detail
app.get('/my_cause_detail/:id_cause', my_cause_detail.view);

//Cause Detail
app.get('/cause_detail/:source/:id_cause', localQuery, cause_detail.view);

//Ajax
app.get('/charities/toggle_favorite', charities_add_favorite.toggleFavorite);
app.get('/charities/add_my_cause', charities.addMyCause);
app.get('/my_cause_detail/:id_cause/:id_saving_amount/:saving_amount', my_cause_detail.updateSavingAmount);
app.get('/session/update_session', update_session.updateSession);

//app.get('/add', add.addFriend);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
