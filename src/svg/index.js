//dependencies

var brick = require('brick');
var html = require('./svg.html');

var app = brick.box();

//create view

var view = brick(html, {
	label: 'hello'
});


//add model brick

view.add('model', require('input-brick'));

//insert view into body

view.build();

//export

module.exports = app;
module.exports.el = view.el;
module.exports.description = require('./description.html');

app.on('console/svg', function(arg) {
	view.set(arg[0], arg[1]);
});