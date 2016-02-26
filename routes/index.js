// Get all of our friend data
var fullData = require('../static_json/data.json');
exports.fullData = fullData;

var user = require('../static_json/user.json');
exports.user = user;

var achievements = require('./achievements').achievements;

var currentHomePage = {"current": "home"};
exports.currentHomePage = currentHomePage;

exports.view = function(req, res){

	if (currentHomePage.current == "homeHistoryOnBottom") {
		res.redirect('/homeHistoryOnBottom');
	}
	else if (currentHomePage.current == "homeDeleteCause") {
		res.redirect('/homeDeleteCause');
	}
	else {
		res.redirect('/home');
	}

	//console.log(data);
	res.render('index', {
		'page_home' : 1,
		"fullData": fullData,
		"user" : user
	});

	for (var i=0; i < fullData.my_causes.length; ++i) {
		var cause = fullData.my_causes[i];
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
	}
	console.log(fullData);
};

//Version to permit to come back to original homepage
exports.home = function(req, res) {
	//if we get here, we will remain with this as homepage
	//so we set current homepage to redirect here from every other link
	currentHomePage.current = "home";

	//console.log(data);
	res.render('index', {
		'page_home' : 1,
		"fullData": fullData,
		"user" : user
	});

	for (var i=0; i < fullData.my_causes.length; ++i) {
		var cause = fullData.my_causes[i];
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
	}
	console.log(fullData);
};

//Alternate version with history button on bottom
exports.homeHistoryOnBottom = function(req, res) {
	//if we get here, we will remain with this as homepage
	//so we set current homepage to redirect here from every other link
	currentHomePage.current = "homeHistoryOnBottom";

	//console.log(data);
	res.render('index_history_bottom', {
		'page_home' : 1,
		"fullData": fullData,
		"user" : user
	});

	for (var i=0; i < fullData.my_causes.length; ++i) {
		var cause = fullData.my_causes[i];
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
	}
	console.log(fullData);
};

//Alternate version with delete cause option
exports.homeDeleteCause = function(req, res) {
	//if we get here, we will remain with this as homepage
	//so we set current homepage to redirect here from every other link
	currentHomePage.current = "homeDeleteCause";

	//console.log(data);
	res.render('index_delete_cause', {
		'page_home' : 1,
		"fullData": fullData,
		"user" : user
	});

	for (var i=0; i < fullData.my_causes.length; ++i) {
		var cause = fullData.my_causes[i];
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
	}
	console.log(fullData);
};

exports.addMoneyToCause = function(req, res) {
	res.render('empty');

	var id_cause = req.params.id_cause;
	var amountToAdd = parseFloat(req.params.amountToAdd);

	//check if money exceeds cause's cost
	var cause = fullData.my_causes[id_cause];
	var cost = parseFloat(cause.charity.cost);
	var money_saved = parseFloat(cause.money_saved);
	if (money_saved + amountToAdd >= cost) {
		cause.money_saved = cause.charity.cost;
		cause.percentage = "100";
		cause.finished = "1";
	}
	else {
		money_saved = money_saved + amountToAdd;
		cause.money_saved = ""+money_saved.toFixed(2);
		cause.percentage = ""+ Math.floor(money_saved / cost * 100);
	}


	var new_balance = parseFloat(user['balance'] != "" ? user['balance'] : "0.00") + amountToAdd;
	user['balance'] = new_balance.toFixed(2).toString();

	console.log(fullData);
	console.log(user);
	
	//Since we added money, we set achievement
	achievements[2].completed = true;

	if (req.params.source == "index") {
		res.redirect('/');
	}
	else {
		res.redirect('/my_cause_detail/' + id_cause);
	}
};

exports.donateToCause = function(req, res) {
	res.render('empty');

	var id_cause = req.params.id_cause;

	var charity = fullData.my_causes[id_cause].charity;

	//add to history
	fullData.history.push({"charity":charity});

	//deduct money from user balance
	var new_balance = parseFloat(user['balance'] != "" ? user['balance'] : "0.00") - parseFloat(charity.cost);
	user['balance'] = "" + new_balance.toFixed(2);

	//we donated, so set achievement
	achievements[3].completed = true;

	//delete from my causes
	res.redirect('/my_cause_detail/deleteCause/' + id_cause);
};
