var fullData = require('./index').fullData;
var user = require('./index').user;

exports.view = function(req, res) {    
	res.render('settings', {
		"page_settings" : 1,
		"fullData" : fullData,
		"user" : user
	});
 }

exports.transferToBank = function(req, res) {
	res.render('empty');

	user['balance'] = "";

	res.redirect('/settings');
}

exports.addBankAccount = function(req, res) {
	res.render('empty');

	user['bank_account'] = "XXXXXXXX " + req.body.bank_account.substr(-3);

	res.redirect('/settings');
}

exports.deleteBankAccount = function(req, res) {
	res.render('empty');

	user['bank_account'] = "";
	user['balance'] = "";

	res.redirect('/settings');
}