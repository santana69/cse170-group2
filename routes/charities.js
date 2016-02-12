var fullData = require('./index').fullData;

exports.view = function(req, res) {    
	res.render('charities', {
		"page_charities" : 1,
		"fullData": fullData
	});

	console.log(fullData);
 }