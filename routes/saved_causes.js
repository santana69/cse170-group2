var fullData = require('./index').fullData;

exports.view = function(req, res) {    
	res.render('saved_causes', {
		"page_saved_causes" : 1,
		"fullData": fullData
	});
/*
	var newVar = {
			"name": "Josh",
			"lastname": "That's Yours"
		}
	my_causes["my_causes"].push(newVar);
*/

	console.log(fullData);
 }