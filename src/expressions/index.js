//dependencies

var brick = require('brick');
var html = require('./expressions.html');

var app = brick.box();

//create view

var view = brick(html, {
	label: 'Antidisestablishmentarianism'
}).build();


//export

module.exports = app;
module.exports.el = view.el;
module.exports.description = require('./description.html');



app.on('console/expression', function(arg) {
	view.set('label', arg[0]);
});