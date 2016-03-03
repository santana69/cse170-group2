// Get all of our friend data
//var fullData = require('../static_json/data.json');
//exports.fullData = fullData;

//var achievements = require('./achievements').achievements;

var currentHomePage = {"current": "home"};
exports.currentHomePage = currentHomePage;

//require DB model
var models = require('../models');

function requireLogin(req, res) {
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
							//next();
							return;
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
	requireLogin(req, res);

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
	requireLogin(req, res);

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
	requireLogin(req, res);
	
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
