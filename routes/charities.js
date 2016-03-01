//var fullData = require('./index').fullData;
//var achievements = require('./achievements').achievements;

//require DB model
var models = require('../models');

exports.view = function(req, res) { 

	//models.User.findByIdAndUpdate(req.user._id, {$set: {"my_causes" : []}}, function(err,affected){});
	
	//Load Charities
	// models.Charity
	// 	.find({
	// 		"enabled" : true
	// 	})
	// 	//.lean() //Causes query to get plain JSON object (modifiable)
	// 	.exec(function(err, charities) {
	// 		if (err) {
	// 			console.log("Charities: error on loadCharities = ", err);
	// 			res.send(500);
	// 		}
	// 		else {
	// 			//Find favorite and my_cause statuses of charities
	// 			var fullCharities = [];
	// 			var saved_causes = [];
	// 			for (var i=0; i<charities.length; ++i) {
	// 				var charity = {
	// 					"charity" : charities[i]
	// 				}

	// 				//Since req.user.my_causes contains populated charity objects, we map a new array with only the ids
	// 				var charIds = req.user.my_causes.map(function(cause) { return cause.charity._id.toString(); });

	// 				//Check if charity id in charIds
	// 				if ( charIds.indexOf(charity.charity._id.toString()) != -1) {
	// 					//Found charity id in user's my_causes, set as my_cause
	// 					charity['my_cause'] = "1";
	// 				}
	// 				else {
	// 					charity['my_cause'] = "";
	// 				}

	// 				//Check if charity id in user favorites
	// 				if ( req.user.favorites.indexOf(charity.charity._id) != -1) {
	// 					//Found charity id in user's favorites, set as favorite
	// 					charity['favorite'] = "1";

	// 					//Since we have it in favorites, we add it to saved_causes
	// 					saved_causes.push(charity);
	// 				}
	// 				else {
	// 					charity['favorite'] = "";
	// 				}



	// 				// if (charity.charity.name == "Charity 8") {
	// 				// 	//Add my_cause
	// 				// 	var my_cause = {
	// 				// 		"charity"		: charity.charity._id,
	// 				// 		"percentage"	: 25,
	// 				// 		"money_saved"	: 100
	// 				// 	};
	// 				// 	models.User.findByIdAndUpdate(
	// 				// 		req.user._id,
	// 				// 		{$push: {"my_causes" : my_cause}},
	// 				// 		{safe : true},
	// 				// 		function(err, model) {console.log(err);}
	// 				// 	);
	// 				// }

	// 				fullCharities.push(charity);
	// 			}

	// 			console.log("CHARITIES: ", fullCharities);
	// 			console.log("SAVEDCAUSES: ", saved_causes);

				var fullData = req.fullData;
				
				var empty = false;
				if (fullData['saved_causes'].length == 0) {
					empty = true;
				}

				res.render('charities', {
					"page_charities" : 1,
					"empty" : empty
				});

				//console.log(fullData);
		// 	}
		// });

	
 }

exports.addMyCause = function(req, res) {
	//res.render('empty');

	var fullData = req.fullData;

	var source = req.query.source;

	if (fullData['my_causes'][3].hasOwnProperty('charity')) {
		//Already full, we cant add more
		res.json({"result" : "full"});
	}
	else {
		// //we're adding a cause, so we set achievement
		// achievements[1].completed = true;
		
		if (source == "saved_causes") {
			var charity = fullData['saved_causes'][req.query.index_charity];

			// //set charity to be one my_cause
			// charity['my_cause'] = "1";

			// //create new json object for new myCause
			// var myCause = {
			// 	"charity" : charity['charity'],
			// 	"percentage" : "0",
			// 	"money_saved" : "0.00",
			// 	"id_saving_amount": "1",
			// 	"saving_amount" : "15c",
			// 	"finished" : ""
			// };

			var my_cause = {
				"charity"		: charity.charity._id
			};
			models.User.findByIdAndUpdate(
				req.user._id,
				{$push: {"my_causes" : my_cause},
				$addToSet : {"achievements" : 1}}, //we're adding a cause, so we set achievement
				{safe : true, new : true},
				function(err, result) {
					if (err) {
						console.log(err);
					}

					console.log("result " + result);
					if (result.my_causes.length == 4) {
						//set achievement
						models.User.findByIdAndUpdate(
							req.user._id,
							{$addToSet : {"achievements" : 4}},
							{safe : true},
							function(err, result) {
								if (err) {
									console.log(err);
								}
							}
						) //achievements[4].completed = true;
					}
				}
			);

			// //find which index to add new cause to
			// var index = 3;
			// for (var i=0; i < fullData['my_causes'].length; ++i) {
			// 	if (!fullData['my_causes'][i].hasOwnProperty('charity')) {
			// 		index = i;
			// 		break;
			// 	}
			// }
			// fullData['my_causes'][index] = myCause;
			// console.log(fullData);

			// //check if index == 3. Means we have 4 causes at a time
			// if (index == 3) {
			// 	//set achievement
			// 	achievements[4].completed = true;
			// }
		}
		else if (source == "charities") {
			var charity = fullData['charities'][req.query.index_charity];

			//set charity to be one my_cause
			// charity['my_cause'] = "1";

			// //create new json object for new myCause
			// var myCause = {
			// 	"charity" : charity['charity'],
			// 	"percentage" : "0",
			// 	"money_saved" : "0.00",
			// 	"id_saving_amount": "1",
			// 	"saving_amount" : "15c",
			// 	"finished" : ""
			// };

			var my_cause = {
				"charity"		: charity.charity._id
			};
			models.User.findByIdAndUpdate(
				req.user._id,
				{$push: {"my_causes" : my_cause},
				$addToSet : {"achievements" : 1}}, //we're adding a cause, so we set achievement
				{safe : true, new : true},
				function(err, result) {
					if (err) {
						console.log(err);
					}

					console.log("result " + result);
					if (result.my_causes.length == 4) {
						//set achievement
						models.User.findByIdAndUpdate(
							req.user._id,
							{$addToSet : {"achievements" : 4}},
							{safe : true},
							function(err, result) {
								if (err) {
									console.log(err);
								}
							}
						) //achievements[4].completed = true;
					}
				}
			);

			// //find which index to add new cause to
			// var index = 3;
			// for (var i=0; i < fullData['my_causes'].length; ++i) {
			// 	if (!fullData['my_causes'][i].hasOwnProperty('charity')) {
			// 		index = i;
			// 		break;
			// 	}
			// }
			// fullData['my_causes'][index] = myCause;
			// console.log(fullData);

			// //check if index == 3. Means we have 4 causes at a time
			// if (index == 3) {
			// 	//set achievement
			// 	achievements[4].completed = true;
			// }
		}

		res.json({"result": "success"});
	}
}