// Get all of our friend data
var fullData = require('../static_json/data.json');
exports.fullData = fullData;

exports.view = function(req, res){
	//console.log(data);
	res.render('index', {
		'page_home' : 1,
		"fullData": fullData
	});

	for (var i=0; i < fullData.my_causes.length; ++i) {
		var cause = fullData.my_causes[i];
		if (cause.percentage == 100) {
			cause['color'] = "success";
		}
		else if (cause.percentage <= 40) {
			cause['color'] = "danger";
		}
		else {
			cause['color'] = "warning";
		}

		if (cause.percentage == 0) {
			cause['progress-empty'] = true;
		}
	}
	console.log(fullData);
};