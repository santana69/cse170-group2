// var fullData = require('./index').fullData;
// var user = require('./index').user;

//require DB model
var models = require('../models');

// var achievements = require('./achievements').achievements;

exports.view = function(req, res) {    
	res.render('createacct');
 };

exports.attemptSignUp = function(req, res) {

	//set user
	// user.id = "2";
	// user.firstname = req.body.firstname;
	// user.lastname = req.body.lastname;
	// user.name = user.firstname + " " + user.lastname;
	// user.email = req.body.email;
	// user.password = req.body.password;
	// user.bank_account = "";
	// user.balance = "";

	//clear fulldata
	// fullData.my_causes = [{},{},{},{}];
	// fullData.saved_causes = [];
	// fullData.history = [];

	// for (var i=0; i<fullData.charities.length; ++i) {
	// 	var currCause = fullData.charities[i];
	// 	currCause.my_cause = "";
	// 	currCause.favorite = "";
	// }

	// //clear achievements (except first one)
	// for (var i=1; i<achievements.length; ++i) {
	// 	achievements[i].completed = false;
	// }

	//clear session
	delete req.session.user;
	delete req.user;
	delete req.fullData;

	// console.log(fullData);
	// console.log(user);
	// console.log(achievements);

	//Check if user exists
	models.User
		.findOne({
			"email" : req.body.email,
			"enabled" : true
		})
		.exec(function(err, user) {
			if (user) {

				//Send success
				res.json({"error" : true, "message" : "User already exists."});
			}
			else {
				//User doesn't exist, create one
				var new_user = new models.User({
					"firstname" : req.body.firstname,
					"lastname" : req.body.lastname,
					"email"	: req.body.email,
					"password" : req.body.password,
					"achievements" : [0] //set first achievement as done
				});
				new_user.save(function(err, user) {
					if (err) {
						console.log("SingUp: error on create new user = " + err);

						//Send success
						res.json({"error" : true, "message" : "Error creating user."});
					}
					else {

						//refresh session value with user data
						req.session.user = user;

						res.json({"error" : false, "message" : "Success"});
					}
				});
			}
		});

	//res.redirect('/');
};

exports.checkEmailExists = function(req, res) {
	console.log("email: "+req.body.email);

	//Check if email already exists for bootstrapValidator
	models.User
		.findOne({
			"email" : req.body.email,
			"enabled" : true
		})
		.exec(function(err, user) {
			if (user || err) {

				//Send success
				res.json({"valid" : false});
			}
			else {
				//Send success
				res.json({"valid" : true});
			}
		});
};