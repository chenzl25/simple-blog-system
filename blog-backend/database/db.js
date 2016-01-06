//built-in
var config = require('../config');
//middleware
var mongoose = require('mongoose');
//self
var User = require('./User');
var Post = require('./Post');

ObjectId = mongoose.Schema.Types.ObjectId;

function init(callback) {

	mongoose.connect(config.url_db, config.options);
	var db = mongoose.connection;

	//error
	db.on('error', function(err) {
		callback(err);
	});
	db.once('open', function () {
		callback(null);
	});
}

function invalid_data_handler(err) {
  // err is our ValidationError object
  // err.errors.password is a ValidatorError object
  for (var i in err.errors) {
	  console.log(err.errors[i].message); // prints 'Validator "Invalid password" failed for path password with value `grease`'
	  console.log(err.errors[i].kind);  // prints "Invalid password"
	  console.log(err.errors[i].path);  // prints "password"
	  console.log(err.errors[i].value); // prints "vlue of password"
  }
}

module.exports.init = init;