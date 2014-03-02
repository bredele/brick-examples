//dependencies

var lego = require('lego');
var html = require('./hello.html');


//create view

var view = lego(html, {
	color: 'red',
	label: 'Hello World'
});


//add model brick

view.add('model', require('input-brick'));

//insert view into body

view.build();

//export

module.exports = view.el;


