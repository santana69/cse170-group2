
var Mongoose = require('mongoose');
exports.Mongoose = Mongoose;

var Schema = Mongoose.Schema;

//User Model
var UserSchema = new Schema({
	"firstname"		: String,
	"lastname" 		: String,
	"email"			: String,
	"password"		: String,
	"bank_account"	: { type : String, default : "", get : obfuscate},
	"balance"		: { type : Number, default : 0, get : getInDollars},
	"notifications"	: { type : Boolean, default : true },
	"my_causes"		: [ {
							"charity" 		: { type : Schema.Types.ObjectId, "ref" : "Charity" },
							"percentage" 	: { type : Number, default : 0 },
							"money_saved"	: { type : Number, default : 0, get: getInDollars },
							"finished"		: { type : Boolean, default : false }
						}
					],
	"favorites"		: [ { type : Schema.Types.ObjectId, "ref" : "Charity" } ],
	"history"		: [ { "charity" : { type : Schema.Types.ObjectId, "ref" : "Charity" } } ],
	"achievements"	: [ { type : Number, "ref" : "Achievement", unique : true, dropDups : true } ],
	"enabled"		: { type : Boolean, default : true }
});

//Function to convert from cents (as stored in DB) to dollars
function getInDollars(balance) {
	return balance > 0 ? ((balance / 100).toFixed(2)) : 0;
}

//Function to obfuscate a user bank_account with XXXX
function obfuscate(bank_account) {
	return (bank_account != "" && bank_account.length >= 3) ? ("XXXXXXXX " + bank_account.substr(-3)) : "";
}

exports.User = Mongoose.model('User', UserSchema);

//Charity Model
var CharitySchema = new Schema({
	"name"			: String,
	"action"		: String,
	"description"	: String,
	"cost"			: { type : Number, get : getInDollars },
	"image"			: String,
	"url"			: String,
	"enabled"		: { type : Boolean, default : true }
});

exports.Charity = Mongoose.model('Charity', CharitySchema);

//Achievement Model
var AchievementSchema = new Schema({
	"_id"			: Number,
	"name"			: String,
	"description"	: String
});

exports.Achievement = Mongoose.model('Achievement', AchievementSchema);

//UserCharity Model (Charities list connected to user to know whether user has it in my_causes or favorites)
// var UserCharity = new Mongoose.Schema({
// 	"charity"	:
// });

//MyCause Model
// var MyCauseSchema = new Schema({
// 	"id_user"			: { type : Schema.Types.ObjectId },
// 	"charity"			: { type : Schema.Types.ObjectId, ref : 'Charity' },
// 	"percentage"		: { type : Number, default : 0 },
// 	"money_saved"		: { type : Number, default : 0, get: getInDollars },
// 	"finished"			: { type : Boolean, default : false }
// });

// exports.MyCause = Mongoose.model('MyCause', MyCauseSchema);
