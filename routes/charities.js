var fullData = require('./index').fullData;
var achievements = require('./achievements').achievements;

exports.view = function(req, res) { 

	var empty = false;
	if (fullData['saved_causes'].length == 0) {
		empty = true;
	}

	res.render('charities', {
		"page_charities" : 1,
		"fullData": fullData,
		"empty" : empty
	});

	console.log(fullData);
 }

exports.addMyCause = function(req, res) {
	//res.render('empty');

	var source = req.query.source;

	if (fullData['my_causes'][3].hasOwnProperty('charity')) {
		//Already full, we cant add more
		res.json({"result" : "full"});
	}
	else {
		//we're adding a cause, so we set achievement
		achievements[1].completed = true;
		
		if (source == "saved_causes") {
			var charity = fullData['saved_causes'][req.query.index_charity];

			//set charity to be one my_cause
			charity['my_cause'] = "1";

			//create new json object for new myCause
			var myCause = {
				"charity" : charity['charity'],
				"percentage" : "0",
				"money_saved" : "0.00",
				"id_saving_amount": "1",
				"saving_amount" : "15c",
				"finished" : ""
			};

			//find which index to add new cause to
			var index = 3;
			for (var i=0; i < fullData['my_causes'].length; ++i) {
				if (!fullData['my_causes'][i].hasOwnProperty('charity')) {
					index = i;
					break;
				}
			}
			fullData['my_causes'][index] = myCause;
			console.log(fullData);

			//check if index == 3. Means we have 4 causes at a time
			if (index == 3) {
				//set achievement
				achievements[4].completed = true;
			}
		}
		else if (source == "charities") {
			var charity = fullData['charities'][req.query.index_charity];

			//set charity to be one my_cause
			charity['my_cause'] = "1";

			//create new json object for new myCause
			var myCause = {
				"charity" : charity['charity'],
				"percentage" : "0",
				"money_saved" : "0.00",
				"id_saving_amount": "1",
				"saving_amount" : "15c",
				"finished" : ""
			};

			//find which index to add new cause to
			var index = 3;
			for (var i=0; i < fullData['my_causes'].length; ++i) {
				if (!fullData['my_causes'][i].hasOwnProperty('charity')) {
					index = i;
					break;
				}
			}
			fullData['my_causes'][index] = myCause;
			console.log(fullData);

			//check if index == 3. Means we have 4 causes at a time
			if (index == 3) {
				//set achievement
				achievements[4].completed = true;
			}
		}

		res.json({"result": "success"});
	}
}