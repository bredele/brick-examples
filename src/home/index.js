
//dependencies

var examples = require('./examples'),
		lego = require('lego'),
		Stack = require('domstack'),
		Search = require('search');

//initialize search field

var search = new Search();


//create view
//NOTE: next release support query selection

var sidebar = lego(document.querySelector('.sidebar'), examples);
var container = lego(document.querySelector('.main')).build();
//create stack
//NOTE: use stack brick

var stack = new Stack(document.querySelector('.stack'));
for(var name in examples) {
	stack.add(name, require(name));
}


//create carret
var caret = lego('<div class="indicator"><span></span></div>');

//add bricks
//NOTE: repeat should take view by default
sidebar.add('examples', require('repeat-brick')(sidebar));
sidebar.add('control', require('control-brick')({
	active: function(target) {
		var ref = target.getAttribute('href').substring(1);
		stack.show(ref);
		container.reset(examples[ref]);
		caret.build(target);
	}
}));
sidebar.add('search', require('events-brick')({
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

// <div class="indicator"><span></span></div>