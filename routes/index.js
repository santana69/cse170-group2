// Get all of our friend data
var fullData = require('../static_json/data.json');
exports.fullData = fullData;

exports.view = function(req, res){
	//console.log(data);
	res.render('index', {
		'page_home' : 1,
		"fullData": fullData
	});

	console.log(fullData);
};