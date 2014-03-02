//dependencies

var lego = require('lego');
var html = require('./console.html');

//global to test
shell = lego.box();

//create view

var view = lego(html);

//insert view into body

view.build();

//export

module.exports = shell;
module.exports.el = view.el;


