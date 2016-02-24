var fullData = require('./index').fullData;
var user = require('./index').user;

exports.view = function(req, res) {   

	res.render('history_detail', {
		"id_cause": req.params.id_cause,
		"cause": fullData.history[req.params.id_cause]
	});
 }