var user = require('./index').user;

exports.view = function(req, res) {    
	res.render('login');
 }

exports.attemptLogin = function(req, res) {

	var email = req.body.email;
	var password = req.body.password;

	if (user.email == email && user.password == password) {
		//found user
		res.json({"error":false, "message":"Success"})
	}
	else {
		res.json({"error":true, "message":"User not found"});
	}
}