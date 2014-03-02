//dependencies

var lego = require('lego'),
    html = require('./todo.html'),
    list = require('repeat-brick'),
    Store = require('store');

//init

var app = lego(html, {
	items: 0,
	pending: 0
});

//TODO:refactor repeat to transform object into store
var todos = list(new Store([]));


app.compute('completed', function() {
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
		app.set('items', todos.store.data.length); //have size
		app.set('pending', count);
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

app.add('todos', todos);
app.add('events', require('events-brick')(controller));
app.add('visible', require('hidden-brick'));
app.build();

// var start = new Date();
// var arr = [];
// for(var l = 200; l--;) {
// 	arr.push({
// 		status : 'pending',
// 		label : 'foo'
// 	});
// }
// todos.store.reset(arr);
// console.log(new Date() - start);

//export

module.exports = app.el;