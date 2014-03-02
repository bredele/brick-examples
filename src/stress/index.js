//dependencies

var lego = require('lego');
var html = require('./stress.html');


//create view

var view = lego(html, {
	color: 'red',
	label: 'Hello World'
});

var anchor = view.el.querySelector('.brick');
for(var l = 500; l--;) {
	anchor.insertAdjacentHTML('beforeend', '<span>{{ label }}</span>');
}

//add model brick

view.add('model', require('input-brick'));

//insert view into body

view.build();

//export

module.exports = view.el;


