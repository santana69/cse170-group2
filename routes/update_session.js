
exports.updateSession = function(req, res) {    
	res.render('empty');

	var source = req.query.source;

	var sessionKey = req.query.sessionKey;

	
	if (sessionKey == "showMyFavorites") {
		var sessionValue = req.query.sessionValue;
		req.session.showMyFavorites = sessionValue;
	}
 }