//dependencies

var lego = require('lego');
var html = require('./computed.html');
var events = require('events-brick');


//create view

var view = lego(html, {
	repo: 'lego',
	github: 'bredele'
});


//create computed property

view.compute('name', function() {
	return this.firstName + ' ' + this.lastName;
});

//add events brick

view.add('ev', events({
	firstName: function(node) {
		view.set('firstName', node.value);
	},
	lastName: function(node) {
		view.set('lastName', node.value);
	}
}));

//insert view into body

view.build(document.body);