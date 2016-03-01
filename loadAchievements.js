
/*
  This script will initialize a local Mongo database
  on your machine so you can do development work.

  IMPORTANT: You should make sure the

      local_database_name

  variable matches its value in app.js  Otherwise, you'll have
  initialized the wrong database.
*/

var mongoose = require('mongoose');
var models   = require('./models');

// Connect to the Mongo database, whether locally or on Heroku
var local_database_uri = 'mongodb://caritydb:Carity%69!@ds019648.mlab.com:19648/heroku_g8zckv7m';
var database_uri = process.env.MONGOLAB_URI || local_database_uri;
mongoose.connect(database_uri);


// Do the initialization here

// Step 1: load the JSON data
var achievements = require('./static_json/achievements.json');

// Step 2: Remove all existing documents
models.Achievement
  .find()
  .remove()
  .exec(onceClear); // callback to continue at

// Step 3: load the data from the JSON file
function onceClear(err) {
  if(err) console.log(err);

  // loop over the projects, construct and save an object from each one
  // Note that we don't care what order these saves are happening in...
  var to_save_count = achievements.length;
  for(var i=0; i<achievements.length; i++) {
    var json = achievements[i];
    var proj = new models.Achievement({
      "_id" : i,
      "name" : json['name'],
      "description" : json['description']
    });

    proj.save(function(err, proj) {
      if(err) console.log(err);

      to_save_count--;
      console.log(to_save_count + ' left to save');
      if(to_save_count <= 0) {
        console.log('DONE');

        //Set all Users to have only first achievement
        models.User.find().update({"achievements" : [0]}).exec(function(err, result) {
          // The script won't terminate until the 
          // connection to the database is closed
          mongoose.connection.close()
        });
      }
    });
  }
}

