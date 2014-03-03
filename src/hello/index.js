//dependencies

var brick = require('brick');
var html = require('./hello.html');

var app = brick.box();

//create view

var view = brick(html, {
	color: 'red',
	label: 'Hello World!'
});


//add model brick

view.add('model', require('input-brick'));

//insert view into body

view.build();

//export

module.exports = app;
module.exports.el = view.el;
module.exports.description = require('./description.html');


app.on('console/hello', function(arg) {
	view.set(arg[0], arg[1]);
});