//require DB model
var models = require('../models');

//var user = require('./index').user;

exports.view = function(req, res) {    
	//If we load login, we destroy session
	req.session.destroy();
	delete req.user;
	delete req.fullData;

	res.render('login');
 }

exports.attemptLogin = function(req, res) {

	var email = req.body.email;
	var password = req.body.password;

	//Lookup user in DB
	models.User
		.find({ 
			"email" 	: email,
			"password" 	: password,
			"enabled"	: true
		})
		.limit(1)
		.exec(function(err, user) {
			if (user && user.length > 0) {
				//console.log("wut" + user[0]);

				//refresh session value with user data
				req.session.user = user[0];

				//console.log("WHY: ", req.session.user);

				//Send success
				res.json({"error" : false, "message" : "Success"});
			}
			else {
				res.json({"error" : true, "message" : "User not found"});
			}
		});
/*
	if (user.email == email && user.password == password) {
		//found user
		res.json({"error":false, "message":"Success"})
	}
	else {
		res.json({"error":true, "message":"User not found"});
	}*/
}