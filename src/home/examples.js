
/**
 * Expose 'Mod'
 */

module.exports = {
	hello: {
		name: 'hello',
		label: 'Hello World!',
		keywords: 'basic,hello,substitution',
		author: 'lego',
		link: 'https://github.com/bredele/lego-examples/tree/master/src/hello',
		description:require('hello').description
	},
	stress: {
		name: 'stress',
		label: 'Stress test',
		keywords: 'basic,hello,substitution,stress,hello',
		author: 'lego',
		link: 'https://github.com/bredele/lego-examples/tree/master/src/stress',
		description:require('stress').description
	}, 
	computed: {
		name: 'computed',
		label: 'Computed properties',
		keywords: 'computed,properties,substitution',
		author: 'lego',
		link: 'https://github.com/bredele/lego-examples/tree/master/src/computed',
		description:require('computed').description
	}, 
	expressions: {
		name: 'expressions',
		label: 'Expressions',
		keywords: 'expressions.substitution,bracket',
		author: 'lego',
		link: 'https://github.com/bredele/lego-examples/tree/master/src/expressions'	,
		description: require('expressions').description
	}, 
	todo: {
		name: 'todo',
		label: 'Todo MVC',
		keywords:'todo,mvc',
		author: 'lego',
		link: 'https://github.com/bredele/lego-examples/tree/master/src/todos'	,
		description: require('todo').description
	}
};