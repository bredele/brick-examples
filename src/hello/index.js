//dependencies

var lego = require('lego');
var html = require('./hello.html');
var events = require('events-brick');


//create view

var view = lego(html, {
	color: 'red',
	label: 'Hello World'
});


//add event brick
view.add('ev', events({
	name: function(target) {
		console.log(target.value);
		view.set('label', target.value);
	}
}));

//insert view into body

view.build(document.body);