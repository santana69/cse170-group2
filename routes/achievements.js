var achievements = require('../static_json/achievements.json');

exports.view = function(req, res) {    
	res.render('achievements', {
		"page_achievements" : 1,
		"achievements" : achievements
	});
 }