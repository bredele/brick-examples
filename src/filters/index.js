//dependencies

var brick = require('brick');
var html = require('./filters.html');

var app = brick.box();

//create view

var view = brick(html, {
});


//add model brick

view.add('model', require('input-brick'));
view.filter('hello', function(str) {
	return 'hello ' + str + '!';
});
view.filter('uppercase', function(str) {
	return str.toUpperCase();
});
//insert view into body

view.build();

//export

module.exports = app;
module.exports.el = view.el;
module.exports.description = require('./description.html');


app.on('console/hello', function(arg) {
	view.set(arg[0], arg[1]);
});