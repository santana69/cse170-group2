var fullData = require('./index').fullData;
var user = require('./index').user;

exports.view = function(req, res) {   

	var empty = false;
	if (fullData['history'].length == 0) {
		empty = true;
	}

	res.render('history', {
		"fullData" : fullData,
		"user" : user,
		"empty" : empty
	});
 }