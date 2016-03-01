//var fullData = require('./index').fullData;

//require DB model
var models = require('../models');

exports.toggleFavorite = function(req, res) {    
	res.render('empty');

	var fullData = req.fullData;

	var source = req.query.source;

	if (source == "saved_causes") {
		var charity = fullData['saved_causes'][req.query.index_charity];

		if (req.query.action == "remove") {

			//Remove from user's favorites
			var charityID = charity.charity._id;
			models.User.findByIdAndUpdate(
					req.user._id,
					{$pull: {"favorites" : charityID}},
					{safe : true},
					function(err, result) {if (err) {console.log(err);} }
				);

			// charity['favorite'] = "";

			// var id_charity = charity.charity['id'];
			// fullData['saved_causes'] = fullData['saved_causes'].filter(function( item, index) {
			// 	return item['charity']['id'] != id_charity;
			// });
		}
		else if (req.query.action == "add") {
			//Add user's favorites
			var charityID = charity.charity._id;
			models.User.findByIdAndUpdate(
					req.user._id,
					{$push: {"favorites" : charityID}},
					{safe : true},
					function(err, result) {if (err) {console.log(err);} }
				);

			// charity['favorite'] = "1";
			// fullData['saved_causes'].push(charity);
			// console.log(fullData);
		}
	}
	else if (source == "charities") {
		var charity = fullData['charities'][req.query.index_charity];

		if (req.query.action == "remove") {
			//Remove from user's favorites
			var charityID = charity.charity._id;
			models.User.findByIdAndUpdate(
					req.user._id,
					{$pull: {"favorites" : charityID}},
					{safe : true},
					function(err, result) {if (err) {console.log(err);} }
				);

			// charity['favorite'] = "";

			// var id_charity = charity.charity['id'];
			// fullData['saved_causes'] = fullData['saved_causes'].filter(function( item, index) {
			// 	return item['charity']['id'] != id_charity;
			// });
		}
		else if (req.query.action == "add") {
			//Add user's favorites
			var charityID = charity.charity._id;
			models.User.findByIdAndUpdate(
					req.user._id,
					{$push: {"favorites" : charityID}},
					{safe : true},
					function(err, result) {if (err) {console.log(err);} }
				);
			// charity['favorite'] = "1";
			// fullData['saved_causes'].push(charity);
			// console.log(fullData);
		}
	}
 }