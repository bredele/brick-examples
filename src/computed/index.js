//dependencies

var lego = require('lego');
var html = require('./computed.html');


//create view

var view = lego(html, {
	repo: 'lego',
	github: 'bredele',
	firstName: '',
	lastName: ''
});


//create computed property

view.compute('name', function() {
	return this.firstName + ' ' + this.lastName;
});

//add events brick

view.add('model', require('input-brick'));

//insert view into body

view.build(document.body);