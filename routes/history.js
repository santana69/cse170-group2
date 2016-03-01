//var fullData = require('./index').fullData;
//var user = require('./index').user;

exports.view = function(req, res) {   

	var fullData = req.fullData;

	var empty = false;
	if (fullData['history'].length == 0) {
		empty = true;
	}

	res.render('history', {
		"empty" : empty
	});
 }