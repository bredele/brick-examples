//dependencies

var brick = require('brick'),
    html = require('./todo.html'),
    list = require('repeat-brick'),
    Store = require('store');

var app = brick.box();

//init

var view = brick(html, {
	items: 0,
	pending: 0
});

//TODO:refactor repeat to transform object into store
var todos = list(new Store([]));


view.compute('completed', function() {
	return this.items - this.pending;
});


//controller 

function stats(cb) {
	return function(target) {
		var count = 0;

		cb.call(null, target.parentElement, target); //remove ev when filter submit event
		todos.loop(function(todo) {
			if(todo.get('status') === 'pending') count++;
		});
		view.set('items', todos.store.data.length); //have size
		view.set('pending', count);
	};
}

var controller = {
	//we should have an input plugin
	add: stats(function(parent, target) {
		var val = target.value;
		if(val) {
			todos.add({
				status : 'pending',
				label : val
			});
			target.value = "";
		}
	}),

	toggle : stats(function(node, target) {
		todos.set(node, {
			status :  target.checked ? 'completed' : 'pending'
		});
	}),

	toggleAll : stats(function(node, target) {
		var status = target.checked ? 'completed' : 'pending';
		todos.loop(function(todo) {
			todo.set('status', status);
		});
	}),

	delAll : stats(function() {
		todos.del(function(todo) {
			return todo.get('status') === 'completed';
		});
	}),

	del : stats(function(node) {
		todos.del(node);
	})
};


//bindings

view.add('todos', todos);
view.add('events', require('events-brick')(controller));
view.add('visible', require('hidden-brick'));
view.build();

//export

app.on('console/todo', function(arg, handler) {
	var start = new Date();
	var arr = [];
	for(var l = arg[0]; l--;) {
		arr.push({
			status : 'pending',
			label : arg[1]
		});
	}
	todos.store.reset(arr);
	handler('benchmark ' + arg[0] + ' items: ' + (new Date() - start) + 'ms');
});

module.exports = app;
module.exports.el = view.el;
module.exports.description = require('./description.html');