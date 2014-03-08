//dependencies

var brick = require('brick');
var html = require('./computed.html');

var app = brick.box();

//create view

var view = brick(html, {
	repo: 'brick',
	github: 'bredele',
	firstName: 'foo',
	lastName: 'bar'
});


//create computed property

view.compute('name', function() {
	return this.firstName + ' ' + this.lastName;
});

//add events brick

view.add('model', require('input-brick'));

//insert view into body

view.build();

//export

module.exports = app;
module.exports.el = view.el;
module.exports.description = require('./description.html');