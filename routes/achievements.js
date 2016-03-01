// var achievements = require('../static_json/achievements.json');
// exports.achievements = achievements;

//require DB model
var models = require('../models');

exports.view = function(req, res) {    
	//Load achievments
	models.Achievement
		.find()
		.lean()
		.exec(function(err, achievements) {
			if (err) {
				console.log("Achievements: error on loadAchievements = " + err);
				res.send(500);
			}
			else {
				for (var i=0; i<achievements.length; ++i) {
					var achievement = achievements[i];

					if ( req.user.achievements.indexOf(achievement._id) != -1) {
						//Ach found, mark as completed
						achievement['completed'] = true;
					}
					else {
						achievement['completed'] = false;
					}
				}

				res.render('achievements', {
					"page_achievements" : 1,
					"achievements" : achievements
				});

				console.log(achievements);
			}
		});
 }