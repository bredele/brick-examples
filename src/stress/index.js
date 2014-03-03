//dependencies

var brick = require('brick');
var html = require('./stress.html');

var app = brick.box();

//create view

var view = brick(html, {
	color: 'red'
});

var anchor = view.el.querySelector('.brick');
for(var l = 1000; l--;) {
	anchor.insertAdjacentHTML('beforeend', '<span>{{ label }}</span>');
}

//add model brick

view.add('model', require('input-brick'));

//insert view into body

view.build();

//export

module.exports = app;
module.exports.el = view.el;
module.exports.description = require('./description.html');


