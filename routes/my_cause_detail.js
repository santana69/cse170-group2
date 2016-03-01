//var fullData = require('./index').fullData;

//require DB model
var models = require('../models');

var currentHomePage = require('./index').currentHomePage;

exports.view = function(req, res) { 

	var fullData = req.fullData;

	res.render('my_cause_detail', {
		"id_cause": req.params.id_cause,
		"cause": fullData.my_causes[req.params.id_cause],
		"currentHomePage" : currentHomePage.current
	});

	console.log("wut"+currentHomePage.current);
	console.log(fullData.charities[0]);
	console.log(fullData.my_causes[req.params.id_cause]);
 }

exports.updateSavingAmount = function(req, res) {
	res.render('empty');

	var fullData = req.fullData;

	fullData.my_causes[req.params.id_cause]['id_saving_amount'] = req.params.id_saving_amount;
	fullData.my_causes[req.params.id_cause]['saving_amount'] = req.params.saving_amount;
}

exports.deleteCause = function(req, res) {
	//res.render('empty');

	var fullData = req.fullData;

	//find charity to set not my_cause
	var charity = fullData.my_causes[req.params.id_cause];

	//Delete from my_causes
	models.User.findByIdAndUpdate(
		req.user._id,
		{$pull: {"my_causes" : { "_id" : charity._id } }},
		{safe : true},
		function(err, result) { 
			if (err) {
				console.log(err);
			} 

			res.redirect('/');
		}
	);

	// for (var i=0; i<fullData['charities'].length; ++i) {
	// 	var currCharity = fullData['charities'][i];
	// 	if (currCharity.charity['id'] == charity['id']) {
	// 		//found it. set my cause no
	// 		currCharity.my_cause = "";
	// 	}
	// }

	// fullData.my_causes.splice(req.params.id_cause,1);

	// fullData.my_causes.push({});

	//console.log(fullData);
}