
//dependencies

var examples = require('./examples'),
		brick = require('brick'),
		Stack = require('domstack'),
		events= require('events-brick'),
		Search = require('search');

var app = brick.box();

//initialize search field

var search = new Search();


//create view
//NOTE: next release support query selection

var sidebar = brick(document.querySelector('.sidebar'), examples);
var container = brick(document.querySelector('.main')).build();
//brick should have convenient handler to avoid that
var description = container.el.querySelector('.description');

//create console stack
var tabs = new Stack(document.querySelector('.sidebar-stack'));
var list = sidebar.el.querySelector('.list-examples');
tabs.add('examples', list, true);
var shell = require('console');
tabs.add('console', shell.el);
app.use('console', shell);
//create examples stack
//NOTE: use stack brick

var stack = new Stack(document.querySelector('.stack'));
for(var name in examples) {
	var child = require(name);
	stack.add(name, child.el);
	app.use(name, child);
}



//create carret

var caret = brick('<div class="indicator"><span></span></div>');

//add bricks
//NOTE: repeat should take view by default

sidebar.add('examples', require('repeat-brick')(sidebar));

sidebar.add('control', require('control-brick')({
	active: function(target) {
		var ref = target.getAttribute('href').substring(1);
		stack.show(ref);
		container.reset(examples[ref]);
		description.innerHTML = examples[ref].description;
		caret.build(target);
	},
	select: function(target){
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
description.innerHTML = examples['hello'].description;
container.reset(examples['hello']);

app.on('console/go', function(arg) {
	var name = arg[0];
	//refactor with active
	stack.show(name);
	description.innerHTML = examples[name].description;
	container.reset(examples[name]);
	caret.build(list.querySelector('[href*='+name+']'));
});