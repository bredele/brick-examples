//dependencies

var brick = require('brick'),
		trim = require('trim');

var html = require('./console.html');

//global to test
var shell = brick.box();

//create view

var view = brick(html, []);
view.add('logs', require('repeat-brick')(view));
view.add('ev', require('events-brick')({
	send: function(target) {
		var cmd = trim(target.value).replace(/\s+/g, ' ').split(' ');
		//the function as arg is bad!!
		//store should have a size handler
		shell.emit(cmd.shift(), cmd, function(str){
			view.set(view.data.length, {
				log: str
			})
		});
		target.value = '';
	}
}));

//insert view into body

view.build();

//export

module.exports = shell;
module.exports.el = view.el;


