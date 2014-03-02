
//dependencies

var examples = require('./examples'),
		lego = require('lego'),
		Stack = require('domstack'),
		events= require('events-brick'),
		Search = require('search');

var app = lego.box();

//initialize search field

var search = new Search();


//create view
//NOTE: next release support query selection

var sidebar = lego(document.querySelector('.sidebar'), examples);
var container = lego(document.querySelector('.main')).build();

//create console stack
var tabs = new Stack(document.querySelector('.sidebar-stack'));
tabs.add('examples', sidebar.el.querySelector('.list-examples'), true);
var console = require('console');
tabs.add('console', console.el);
app.use('console', console)
//create examples stack
//NOTE: use stack brick

var stack = new Stack(document.querySelector('.stack'));
for(var name in examples) {
	var child = require(name);
	stack.add(name, child.el);
	app.use(name, child);
}



//create carret

var caret = lego('<div class="indicator"><span></span></div>');

//add bricks
//NOTE: repeat should take view by default

sidebar.add('examples', require('repeat-brick')(sidebar));

// sidebar.add('events', events({
// 	list: function(){
// 		tabs.show('examples');
// 	},
// 	console: function(){
// 		console.log('console');
// 		tabs.show('console');
// 	}
// }));

sidebar.add('control', require('control-brick')({
	active: function(target) {
		var ref = target.getAttribute('href').substring(1);
		stack.show(ref);
		container.reset(examples[ref]);
		caret.build(target);
	},
	select: function(target){
		console.log(target.innerHTML.toLowerCase());
		tabs.show(target.innerHTML.toLowerCase());
	}
}));

sidebar.add('search', events({
	search: function(target) {
		search.run(target.value);
	}
}));

sidebar.build();


//show hello world
var first = sidebar.el.querySelectorAll('.example-item')[0];
caret.build(first);
stack.show('hello');
container.reset(examples['hello']);