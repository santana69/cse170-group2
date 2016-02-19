var fullData = require('./index').fullData;

exports.view = function(req, res) { 
	res.render('charities', {
		"page_charities" : 1,
		"fullData": fullData
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
		if (source == "saved_causes") {
			var charity = fullData['saved_causes'][req.query.index_charity];

			//set charity to be one my_cause
			charity['my_cause'] = "1";

			//create new json object for new myCause
			var myCause = {
				"charity" : charity['charity'],
				"percentage" : "0",
				"id_saving_amount": "1",
				"saving_amount" : "15c",
				"finished" : ""
			};
			fullData['my_causes'][fullData['my_causes'].length - 1] = myCause;
			console.log(fullData);
		}
		else if (source == "charities") {
			var charity = fullData['charities'][req.query.index_charity];

			//set charity to be one my_cause
			charity['my_cause'] = "1";

			//create new json object for new myCause
			var myCause = {
				"charity" : charity['charity'],
				"percentage" : "0",
				"id_saving_amount": "1",
				"saving_amount" : "15c",
				"finished" : ""
			};
			fullData['my_causes'][fullData['my_causes'].length - 1] = myCause;
			console.log(fullData);
		}

		res.json({"result": "success"});
	}
}