
/**
 * Expose 'Mod'
 */

module.exports = {
	hello: {
		name: 'hello',
		label: 'Hello World!',
		keywords: 'basic,hello,substitution',
		author: 'brick',
		link: 'https://github.com/bredele/lego-examples/tree/master/src/hello',
		description:require('hello').description
	},
	stress: {
		name: 'stress',
		label: 'Stress test',
		keywords: 'basic,hello,substitution,stress,hello',
		author: 'brick',
		link: 'https://github.com/bredele/lego-examples/tree/master/src/stress',
		description:require('stress').description
	}, 
	computed: {
		name: 'computed',
		label: 'Computed properties',
		keywords: 'computed,properties,substitution',
		author: 'brick',
		link: 'https://github.com/bredele/lego-examples/tree/master/src/computed',
		description:require('computed').description
	}, 
	expressions: {
		name: 'expressions',
		label: 'Expressions',
		keywords: 'expressions.substitution,bracket',
		author: 'brick',
		link: 'https://github.com/bredele/lego-examples/tree/master/src/expressions'	,
		description: require('expressions').description
	}, 
	todo: {
		name: 'todo',
		label: 'Todo MVC',
		keywords:'todo,mvc',
		author: 'brick',
		link: 'https://github.com/bredele/lego-examples/tree/master/src/todo'	,
		description: require('todo').description
	}
};