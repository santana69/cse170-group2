var fullData = require('./index').fullData;

exports.toggleFavorite = function(req, res) {    
	res.render('empty');

	var source = req.query.source;

	if (source == "saved_causes") {
		console.log("WHY");
		var charity = fullData['saved_causes'][req.query.index_charity];

		if (req.query.action == "remove") {
			charity['favorite'] = "";

			var id_charity = charity.charity['id'];
			fullData['saved_causes'] = fullData['saved_causes'].filter(function( item, index) {
				return item['charity']['id'] != id_charity;
			});
		}
		else if (req.query.action == "add") {
			charity['favorite'] = "1";
			fullData['saved_causes'].push(charity);
			console.log(fullData);
		}
	}
	else if (source == "charities") {
		var charity = fullData['charities'][req.query.index_charity];

		if (req.query.action == "remove") {
			charity['favorite'] = "";

			var id_charity = charity.charity['id'];
			fullData['saved_causes'] = fullData['saved_causes'].filter(function( item, index) {
				return item['charity']['id'] != id_charity;
			});
		}
		else if (req.query.action == "add") {
			charity['favorite'] = "1";
			fullData['saved_causes'].push(charity);
			console.log(fullData);
		}
	}
 }