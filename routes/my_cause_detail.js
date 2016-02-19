var fullData = require('./index').fullData;

exports.view = function(req, res) { 

	res.render('my_cause_detail', {
		"id_cause": req.params.id_cause,
		"cause": fullData.my_causes[req.params.id_cause]
	});

	console.log(fullData.my_causes[req.params.id_cause]);
 }

exports.updateSavingAmount = function(req, res) {
	res.render('empty');

	fullData.my_causes[req.params.id_cause]['id_saving_amount'] = req.params.id_saving_amount;
	fullData.my_causes[req.params.id_cause]['saving_amount'] = req.params.saving_amount;
}