var blocks = [
	{ "id": 1, "content": "Dit is een tekstveld #1", "cols": 4, "type": "text" },
	{ "id": 2, "content": "Dit is een tekstveld #2", "cols": 2, "type": "text" },
	{ "id": 3, "content": "Dit is een tekstveld #3", "cols": 2, "type": "text" },
	{ "id": 4, "content": "Dit is een tekstveld #4", "cols": 3, "type": "text" },
	{ "id": 5, "content": "Dit is een tekstveld #5", "cols": 1, "type": "text" },
	{ "id": 6, "content": "Dit is een tekstveld #6", "cols": 2, "type": "text" },
	{ "id": 7, "content": "Dit is een tekstveld #7", "cols": 2, "type": "text" },
	{ "id": 8, "content": "Dit is een tekstveld #8", "cols": 4, "type": "text" },
	{ "id": 9, "content": "Dit is een tekstveld #9", "cols": 1, "type": "text" },
	{ "id": 10, "content": "Dit is een tekstveld #10", "cols": 3, "type": "text" }
];

var styles = {
	'font_size': '14px',
	'color': '#000000',
	'font_family': 'arial',
	'font_weight': 'normal'
}

exports.edit = function(req, res) {
	res.render('document/edit', {
		'pageTitle': 'Document wijzigen',
		'styles': styles,
		'blocks': blocks
	});
};

exports.setstyle = function (req, res) {
	styles[req.body]
	var data = req.body;
	//console.log(data);
	for (var key in data) {
		styles[key] = data[key];
	}
	res.send(data);
}

exports.getstyle = function (req, res) {
	res.send(styles);
}