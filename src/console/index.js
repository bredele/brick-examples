//dependencies

var lego = require('lego');
var html = require('./console.html');


//create view

var console = lego(html);

//insert view into body

console.build();

//export

module.exports = console.el;


