var fullData = require('./index').fullData;
var user = require('./index').user;
var achievements = require('./achievements').achievements;

exports.view = function(req, res) {    
	res.render('createacct');
 };

exports.attemptSignUp = function(req, res) {

	//set user
	user.id = "2";
	user.firstname = req.body.firstname;
	user.lastname = req.body.lastname;
	user.name = user.firstname + " " + user.lastname;
	user.email = req.body.email;
	user.password = req.body.password;
	user.bank_account = "";
	user.balance = "";

	//clear fulldata
	fullData.my_causes = [{},{},{},{}];
	fullData.saved_causes = [];

	for (var i=0; i<fullData.charities.length; ++i) {
		var currCause = fullData.charities[i];
		currCause.my_cause = "";
		currCause.favorite = "";
	}

	//clear achievements (except first one)
	for (var i=1; i<achievements.length; ++i) {
		achievements[i].completed = false;
	}

	//clear session
	req.session.destroy();

	console.log(fullData);
	console.log(user);
	console.log(achievements);

	res.redirect('/');
};