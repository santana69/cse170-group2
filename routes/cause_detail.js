//var fullData = require('./index').fullData;

exports.view = function(req, res) {    
	var fullData = req.fullData;

	var cause;
	var source;
	if (req.params.source == "saved_causes") {
		cause = fullData['saved_causes'][req.params.id_cause];
		source = "saved_causes";
	}
	else {
		cause = fullData['charities'][req.params.id_cause];
		source = "";
	}

	res.render('cause_detail', {
		"id_cause": req.params.id_cause,
		"cause": cause,
		"source_saved_causes" : source
	});

	console.log(cause);
 }