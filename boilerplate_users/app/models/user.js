var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/user-test')
	Validator = require('validator').Validator;

var userSchema = new mongoose.Schema({
	email		: {type: String, required : true, index: {unique: true} },
	first		: {type: String, required : true },
	last		: {type: String, required : true },
	admin		: {type: Number, required : true, default: 0}
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
	validator.check(params.first).notEmpty(); 
	validator.check(params.last).notEmpty();

	validator.check(params.password).equals(params.confirmPassword);
	validator.check(params.email).len(6, 64).isEmail(); 

	var errors = validator.getErrors();

	var user = new User({
		email: params['email'], 
		first: params['first'], 
		last: params['last'], 
		username: params['username'], 
		password: params['password']
	});

	if(errors.length == 0) {
		user.save(function (err) {
			callback(null);
		});
	}
	else {
		callback(errors);
	}
};

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