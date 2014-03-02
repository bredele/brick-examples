//dependencies

var lego = require('lego');
var html = require('./expressions.html');

var app = lego.box();

//create view

var view = lego(html, {
	random: 'hello'
}).build();


//crete random strings

setInterval(function(){
  var nb = Math.floor(Math.random() * 8) + 1;
  var str = Math.random().toString(36).substring(7);
  view.set('random', str.substring(1,nb));
}, 700);
//create random string

//export

module.exports = app;
module.exports.el = view.el;