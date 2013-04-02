var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/user-test')
	Validator = require('validator').Validator;

var userSchema = new mongoose.Schema({
	email		: {type: String, required : true, index: {unique: true} },
	first		: {type: String },
	last		: {type: String },
	admin		: {type: Number, required : true, default: 0},
	token       : {type: String, required : true}
});

userSchema.plugin(require('basic-auth-mongoose'));
var User = mongoose.model('User', userSchema);

modelFunctions = function(){};

modelFunctions.prototype.findAll = function(callback) {
	User.find(function(err, users) {
		if ( ! err) {
			callback(null, users);
		}
	}).sort({'username' : '-1'});
};

modelFunctions.prototype.findByUsername = function(username, callback) {
	User.findOne({'username' : { $regex : new RegExp(username, "i") }}, function (err, user) {
		if (! err){
			callback(user);
		}
	});
}

modelFunctions.prototype.deleteByUsername = function(username, callback) {
	User.findOne({'username' : { $regex : new RegExp(username, "i") }}, function (err, user){
		if ( ! err ){
			User.remove({'username' : user.username}, function(err){
				if ( ! err) {
					callback(null);
				}
				else {
					callback(err);
				}
			});
		}
		else {
			callback(err);
		}
	});
}

modelFunctions.prototype.update = function(username, params, callback){
	User.findOne({'username' : { $regex : new RegExp(username, "i") }}, function (err, user) {
		if (! err){
			
			Validator.prototype.error = function (msg) {
			    this._errors.push(msg);
			    return this;
			}
		
			Validator.prototype.getErrors = function () {
			    return this._errors;
			}
		
			var validator = new Validator();
		
			validator.check(params.email).notEmpty(); 
			validator.check(params.first).notEmpty(); 
			validator.check(params.last).notEmpty();
			validator.check(params.email).len(6, 64).isEmail();
			validator.check(params.admin).notEmpty();
			
			user.email = params['email'], 
			user.first = params['first'], 
			user.last = params['last'], 
			user.username = params['username'],
			user.admin = params['admin'];
						
			if (validator.check(params.oldPassword).notEmpty()){
				if (user.authenticate(params.oldPassword)){
					validator.check(params.newPassword).equals(params.confirmNewPassword);
					user.password = params['newPassword'];
				}
			}
		
			var errors = validator.getErrors();
			
			user.save(function (err) {
				if (! err) {
					callback(null);
				}
				else {
					callback(err);
				}
			});
		}
	});
}

modelFunctions.prototype.save = function(params, callback) {
	
	//Validate
	Validator.prototype.error = function (msg) {
	    this._errors.push(msg);
	    return this;
	}

	Validator.prototype.getErrors = function () {
	    return this._errors;
	}

	var validator = new Validator();

	validator.check(params.email).notEmpty();
	validator.check(params.password).equals(params.confirmPassword);
	validator.check(params.email).len(6, 64).isEmail(); 

	var errors = validator.getErrors();

	// random string for email validation
	var randomstring = require("randomstring");
	var token = randomstring.generate();

	var user = new User({
		email: params['email'],
		username: params['username'],
		password: params['password'],
		token: token
	});

	if(errors.length == 0) {
		user.save(function (err) {
			callback(null);
		});

		this.sendEmail( params['username'], params['email'], token);

	}

	else {
		callback(errors);
	}
};


// sends e-mail
modelFunctions.prototype.sendEmail = function(username, user_email, token, callback){

		var activation_link = "<a href=\x22localhost:1337/users/activate/"+token+"\x22>link</a>";

		// e-mail settings
		var email   = require("../..//node_modules/emailjs/email");
		var server  = email.server.connect({
		   user:    "doctopus.nl@gmail.com", 
		   password:"borstenzijncool", 
		   host:    "smtp.gmail.com", 
		   ssl:     true
		});

		// send the message and get a callback with an error or details of the message that was sent
		server.send({
		   text:    "Thanks "+username+" for using Doctopus! please click this "+activation_link+" to activate your account", 
		   from:    "you <doctopus.nl@gmail.com>", 
		   to:      "<"+user_email+">",
		   subject: "Activation e-mail Doctopus"
		}, function(err, message) { console.log(err || message); });
}


modelFunctions.prototype.isAdmin = function(username, callback) {
	User.findOne({'username' : username}, function(err, user){
		if (err) {
			callback(err);
		}
		else {
			callback(null, user.admin);
		}
	});
}

modelFunctions.prototype.auth = function(req, callback) {

	var username = null;
	
	User.findOne({'email' : req.email}, function (err, found_user) {
		if (err) {
			var error = 'Failed to login';
		} // handle
		else {
			if (found_user) {
				if (found_user.authenticate(req.password)) {
					var error = false;
					var username = found_user.username;
				}
				else {
					var error = 'password does not match';
				}
			}
		}
		callback(error, username);
	});
};

exports.modelFunctions = modelFunctions;