//var fullData = require('./index').fullData;

//require DB model
var models = require('../models');

exports.view = function(req, res) {    

	//check if causes active
	var fullData = req.fullData;

	var size = fullData.my_causes.length;
	var active = false;
	for (var i=0; i<size; ++i) {
		if (fullData['my_causes'][i].hasOwnProperty('charity'))	{
			//found an active cause.
			active = true;
			break;
		}
	}

	res.render('settings', {
		"page_settings" : 1,
		"active_causes" : active
	});
 }

exports.transferToBank = function(req, res) {
	//res.render('empty');

	//Update user balance
	models.User
		.find({
			"_id" : req.user._id
		})
		.update({
			"balance" : 0
		})
		.exec(function(err) {
			if (err) {
				console.log("Settings: error on transferToBank = " + err);
			}

			//In any case, redirect to settings.
			res.redirect('/settings');
		});
	//user['balance'] = "";

	
}

exports.addBankAccount = function(req, res) {
	//res.render('empty');

	//Update user bank account
	models.User
		.find({
			"_id" : req.user._id
		})
		.update({
			"bank_account" : req.body.bank_account
		})
		.exec(function(err) {
			if (err) {
				console.log("Settings: error on addBankAccount = " + err);
			}

			//In any case, redirect to settings.
			res.redirect('/settings');
		});
	//user['bank_account'] = "XXXXXXXX " + req.body.bank_account.substr(-3);

	//res.redirect('/settings');
}

exports.deleteBankAccount = function(req, res) {
	//res.render('empty');

	//Delete user bank account
	models.User
		.find({
			"_id" : req.user._id
		})
		.update({
			"bank_account" : "",
			"balance" : 0
		})
		.exec(function(err) {
			if (err) {
				console.log("Settings: error on deleteBankAccount = " + err);
			}

			//In any case, redirect to settings.
			res.redirect('/settings');
		});

	// user['bank_account'] = "";
	// user['balance'] = "";

	// res.redirect('/settings');
}