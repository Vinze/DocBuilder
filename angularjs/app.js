// Include the required modules
var express = require('express'),
	app = express(),
	todos = require('./routes/todos');

// Configure the application
app.configure(function() {

	// Enable the bodyParser so we can access POST data
	app.use(express.bodyParser());
	
	// Enable the cookieParser so we can work with cookies
	app.use(express.cookieParser('super-duper-secret'));

	// add req.session cookie support
	app.use(express.cookieSession());

	// Enable the logging
	app.use(express.logger('dev'));

	// Set the path to the public directory
	app.use(express.static(__dirname + '/public'));

	// Set the views directory
	app.set('views', __dirname + '/views');

	// Set the view engine
	app.set('view engine', 'jade');
});

// GET routes
app.get('/', todos.index);
app.get('/todos/list.json', todos.listJSON);

// POST routes
app.post('/todos/create', todos.create);
app.post('/todos/delete', todos.delete);

// Load the todos partials
app.get('/todos/:partial', todos.partials);

// Let the app listen op port 1337
app.listen(1337);

// Set the console message
console.log('Application accessible at http://localhost:1337');