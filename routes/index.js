// Get all of our friend data
//var fullData = require('../static_json/data.json');
//exports.fullData = fullData;

//var achievements = require('./achievements').achievements;

var currentHomePage = {"current": "home"};
exports.currentHomePage = currentHomePage;

//require DB model
var models = require('../models');

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
	
	var fullData = req.fullData;

	res.render('index', {
		'page_home' : 1
	});

	// for (var i=0; i < fullData.my_causes.length; ++i) {
	// 	var cause = fullData.my_causes[i];
	// 	if (cause.percentage == 100) {
	// 		cause['color'] = "success";
	// 	}
	// 	else if (cause.percentage <= 40) {
	// 		cause['color'] = "danger";
	// 	}
	// 	else {
	// 		cause['color'] = "warning";
	// 	}

	// 	//progress-empty is used to set color of progressbar text to black instead of white for visibility
	// 	if (parseInt(cause.percentage) <= 28) {
	// 		cause['progress-empty'] = true;
	// 	}
	// 	else {
	// 		cause['progress-empty'] = false;
	// 	}
	// }
	// console.log(fullData);
	
};

//Version to permit to come back to original homepage
exports.home = function(req, res) {
	//if we get here, we will remain with this as homepage
	//so we set current homepage to redirect here from every other link
	currentHomePage.current = "home";

	//Verify login here
	if (req.redirect) {
		res.redirect('/login');
	}


	//Get my_causes
	// models.MyCause
	// 	.find({
	// 		"id_user" : req.user._id
	// 	})
	// 	.populate("charity")
	// 	.exec(function(err, my_causes) {
	// models.Charity
	// 	.find()
	// 	.exec(function(err, charities) { 
			// if (err) {
			// 	console.log("Home: error on loading myCauses = " + err);
			// 	res.send(500); 
			// }
			// else {
				// console.log("MYCAUSES: " + my_causes);
				//console.log("CHARITIES: " + charities);

	var fullData = req.fullData;

				res.render('index', {
					'page_home' : 1
				});

				// for (var i=0; i < fullData.my_causes.length; ++i) {
				// 	var cause = fullData.my_causes[i];
				// 	if (cause.percentage == 100) {
				// 		cause['color'] = "success";
				// 	}
				// 	else if (cause.percentage <= 40) {
				// 		cause['color'] = "danger";
				// 	}
				// 	else {
				// 		cause['color'] = "warning";
				// 	}

				// 	//progress-empty is used to set color of progressbar text to black instead of white for visibility
				// 	if (parseInt(cause.percentage) <= 28) {
				// 		cause['progress-empty'] = true;
				// 	}
				// 	else {
				// 		cause['progress-empty'] = false;
				// 	}
				// }
				// console.log(fullData);
		// 	}
		// });


					
};

//Alternate version with history button on bottom
exports.homeHistoryOnBottom = function(req, res) {
	//if we get here, we will remain with this as homepage
	//so we set current homepage to redirect here from every other link
	currentHomePage.current = "homeHistoryOnBottom";

	//Verify login here
	if (req.redirect) {
		res.redirect('/login');
	}

	var fullData = req.fullData;

	//console.log(data);
	res.render('index_history_bottom', {
		'page_home' : 1
	});

	// for (var i=0; i < fullData.my_causes.length; ++i) {
	// 	var cause = fullData.my_causes[i];
	// 	if (cause.percentage == 100) {
	// 		cause['color'] = "success";
	// 	}
	// 	else if (cause.percentage <= 40) {
	// 		cause['color'] = "danger";
	// 	}
	// 	else {
	// 		cause['color'] = "warning";
	// 	}

	// 	//progress-empty is used to set color of progressbar text to black instead of white for visibility
	// 	if (parseInt(cause.percentage) <= 28) {
	// 		cause['progress-empty'] = true;
	// 	}
	// 	else {
	// 		cause['progress-empty'] = false;
	// 	}
	// }
	// console.log(fullData);
};

//Alternate version with delete cause option
exports.homeDeleteCause = function(req, res) {
	//if we get here, we will remain with this as homepage
	//so we set current homepage to redirect here from every other link
	currentHomePage.current = "homeDeleteCause";

	//Verify login here
	if (req.redirect) {
		res.redirect('/login');
	}


	var fullData = req.fullData;

	//console.log(data);
	res.render('index_delete_cause', {
		'page_home' : 1
	});

	// for (var i=0; i < fullData.my_causes.length; ++i) {
	// 	var cause = fullData.my_causes[i];
	// 	if (cause.percentage == 100) {
	// 		cause['color'] = "success";
	// 	}
	// 	else if (cause.percentage <= 40) {
	// 		cause['color'] = "danger";
	// 	}
	// 	else {
	// 		cause['color'] = "warning";
	// 	}

	// 	//progress-empty is used to set color of progressbar text to black instead of white for visibility
	// 	if (parseInt(cause.percentage) <= 28) {
	// 		cause['progress-empty'] = true;
	// 	}
	// 	else {
	// 		cause['progress-empty'] = false;
	// 	}
	// }
	// console.log(fullData);
};

exports.addMoneyToCause = function(req, res) {
	//res.render('empty');

	var fullData = req.fullData;

	var id_cause = req.params.id_cause;
	var amountToAdd = parseFloat(req.params.amountToAdd);

	//check if money exceeds cause's cost
	var cause = fullData.my_causes[id_cause];
	var cost = parseFloat(cause.charity.cost);
	var money_saved = parseFloat(cause.money_saved);
	if (money_saved + amountToAdd >= cost) {
		money_saved = cost;
		cause.percentage = 100;
		cause.finished = true;
	}
	else {
		money_saved = money_saved + amountToAdd;
		cause.money_saved = money_saved;
		cause.percentage = Math.floor(money_saved / cost * 100);
	}

	//Since we added money, we set achievement
	//achievements[2].completed = true;

	//Update user
	models.User.findOneAndUpdate(
		{ "_id" : req.user._id, "my_causes._id" : cause._id},
		{$set: { "my_causes.$.money_saved" : money_saved * 100, "my_causes.$.percentage" : cause.percentage, "my_causes.$.finished" : cause.finished },
		$addToSet : {"achievements" : 2} },
		function(err, result) {
			if (err) {
				console.log("Home: error on addMoneyToCause while updating user = " + err);
			}
			
			//calculate new balance
			var new_balance = parseFloat(req.user['balance']) + amountToAdd;

			//Update user balance
			models.User
				.find({
					"_id" : req.user._id
				})
				.update({
					"balance" : new_balance * 100
				})
				.exec(function(err) {
					if (err) {
						console.log("Home: error on addMoneyToCause while updating balance = " + err);
					}

					//In any case, redirect
					if (req.params.source == "index") {
						res.redirect('/');
					}
					else {
						res.redirect('/my_cause_detail/' + id_cause);
					}
				});
		}
	);

	
	// var new_balance = parseFloat(user['balance'] != "" ? user['balance'] : "0.00") + amountToAdd;
	// user['balance'] = new_balance.toFixed(2).toString();

	// console.log(fullData);
	// console.log(user);

	
};

exports.donateToCause = function(req, res) {
	//res.render('empty');

	var fullData = req.fullData;

	var id_cause = req.params.id_cause;

	var charity = fullData.my_causes[id_cause].charity;

	//add to history
	//fullData.history.push({"charity":charity});

	//we donated, so set achievement
	//achievements[3].completed = true;

	//deduct money from user balance
	//calculate new balance
	var new_balance = parseFloat(req.user['balance']) - parseFloat(charity.cost);

	//Update user balance
	models.User
		.find({
			"_id" : req.user._id
		})
		.update({
			"balance" : new_balance * 100, //update balance
			$push : {"history" : {"charity" : charity._id } },
			$addToSet : {"achievements" : 3}
		})
		.exec(function(err) {
			if (err) {
				console.log("Home: error on donateToCause while updating balance = " + err);
			}

			//In any case, redirect
			//delete from my causes
			res.redirect('/my_cause_detail/deleteCause/' + id_cause);
		});
	// var new_balance = parseFloat(user['balance'] != "" ? user['balance'] : "0.00") - parseFloat(charity.cost);
	// user['balance'] = "" + new_balance.toFixed(2);
	
};
