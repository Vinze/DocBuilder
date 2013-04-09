var Sequelize = require('sequelize');
var sequelize = new Sequelize('angular-todo', 'root', 'usbw', {
	host: 'localhost',
	port: 3306,
	freezeTableName: true
});

// Set the todo model
var Todo = sequelize.define('Todo', 
	{	name: Sequelize.STRING,
		title: Sequelize.STRING
	},
	{	tableName: 'todos',
		underscored: true
	}
);

exports.index = function(req, res) {
	res.render('todos/index.jade', {
		pageTitle: 'Todolist AngularJS'
	});
}

exports.findAll = function(req, res) {
	Todo.findAll().success(function(todos) {
		res.send(todos)
	});
}

exports.findOne = function(req, res) {
	id = req.params.id;
	Todo.find(id).success(function(todo) {
		res.send(todo);
	});
}

exports.insert = function(req, res) {
	Todo.create({name: req.body.name, title: req.body.title}).success(function(todo) {
		res.send(todo);
	});
}

exports.update = function(req, res) {
	res.send(req.params.id);
}

exports.delete = function(req, res) {
	res.send(req.params.id);
}

exports.partial = function(req, res){
	var filePath = 'todos/partials/'+req.params.partial+'.jade';
	res.render(filePath);
};