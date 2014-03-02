/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("bredele-each/index.js", function(exports, require, module){

/**
 * Expose 'each'
 */

module.exports = function(obj, fn, scope){
  if( obj instanceof Array) {
    array(obj, fn, scope);
  } else if(typeof obj === 'object') {
    object(obj, fn, scope);
  }
};


/**
 * Object iteration.
 * @param  {Object}   obj   
 * @param  {Function} fn    
 * @param  {Object}   scope 
 * @api private
 */

function object(obj, fn, scope) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      fn.call(scope, i, obj[i]);
    }
  }
}


/**
 * Array iteration.
 * @param  {Array}   obj   
 * @param  {Function} fn    
 * @param  {Object}   scope 
 * @api private
 */

function array(obj, fn, scope){
  for(var i = 0, l = obj.length; i < l; i++){
    fn.call(scope, i, obj[i]);
  }
}
});
require.register("bredele-clone/index.js", function(exports, require, module){

/**
 * Expose 'clone'
 * @param  {Object} obj 
 * @api public
 */

module.exports = function(obj) {
  var cp = null;
  if(obj instanceof Array) {
    cp = obj.slice(0);
  } else {
    //hasOwnProperty doesn't work with Object.create
    // cp = Object.create ? Object.create(obj) : clone(obj);
    cp = clone(obj);
  }
  return cp;
};


/**
 * Clone object.
 * @param  {Object} obj 
 * @api private
 */

function clone(obj){
  if(typeof obj === 'object') {
    var copy = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = clone(obj[key]);
      }
    }
    return copy;
  }
  return obj;
}
});
require.register("bredele-store/index.js", function(exports, require, module){
var Emitter = require('emitter'),
		clone = require('clone'),
		each = require('each'),
		storage = window.localStorage;

/**
 * Expose 'Store'
 */

module.exports = Store;


/**
 * Store constructor
 * @api public
 */

function Store(data) {
	if(data instanceof Store) return data;
	this.data = data || {};
	this.formatters = {};
}


Emitter(Store.prototype);

/**
 * Set store attribute.
 * @param {String} name
 * @param {Everything} value
 * @api public
 */

Store.prototype.set = function(name, value, plugin) { //add object options
	var prev = this.data[name];
	//TODO: what happend if update store-object with an array and vice versa?
	if(typeof name === 'object') return each(name, this.set, this);
	if(prev !== value) {
		this.data[name] = value;
		this.emit('change', name, value, prev);
		this.emit('change ' + name, value, prev);
	}
};


/**
 * Get store attribute.
 * @param {String} name
 * @return {Everything}
 * @api public
 */

Store.prototype.get = function(name) {
	var formatter = this.formatters[name];
	var value = this.data[name];
	if(formatter) {
		value = formatter[0].call(formatter[1], value);
	}
	return value;
};

/**
 * Get store attribute.
 * @param {String} name
 * @return {Everything}
 * @api private
 */

Store.prototype.has = function(name) {
	//NOTE: I don't know if it should be public
	return this.data.hasOwnProperty(name);
};


/**
 * Delete store attribute.
 * @param {String} name
 * @return {Everything}
 * @api public
 */

Store.prototype.del = function(name) {
	//TODO:refactor this is ugly
	if(this.has(name)){
		if(this.data instanceof Array){
			this.data.splice(name, 1);
		} else {
			delete this.data[name]; //NOTE: do we need to return something?
		}
		this.emit('deleted', name, name);
		this.emit('deleted ' + name, name);
	}
};


/**
 * Set format middleware.
 * Call formatter everytime a getter is called.
 * A formatter should always return a value.
 * @param {String} name
 * @param {Function} callback
 * @param {Object} scope
 * @return this
 * @api public
 */

Store.prototype.format = function(name, callback, scope) {
	this.formatters[name] = [callback,scope];
	return this;
};


/**
 * Compute store attributes
 * @param  {String} name
 * @return {Function} callback                
 * @api public
 */

Store.prototype.compute = function(name, callback) {
	//NOTE: I want something clean instaead passing the computed 
	//attribute in the function
	var str = callback.toString();
	var attrs = str.match(/this.[a-zA-Z0-9]*/g);

	this.set(name, callback.call(this.data)); //TODO: refactor (may be use replace)
	for(var l = attrs.length; l--;){
		this.on('change ' + attrs[l].slice(5), function(){
			this.set(name, callback.call(this.data));
		});
	}
};


/**
 * Reset store
 * @param  {Object} data 
 * @api public
 */

Store.prototype.reset = function(data) {
	var copy = clone(this.data),
		length = data.length;
		this.data = data;

	each(copy, function(key, val){
		if(typeof data[key] === 'undefined'){
			this.emit('deleted', key, length);
			this.emit('deleted ' + key, length);
		}
	}, this);

	//set new attributes
	each(data, function(key, val){
		//TODO:refactor with this.set
		var prev = copy[key];
		if(prev !== val) {
			this.emit('change', key, val, prev);
			this.emit('change ' + key, val, prev);
		}
	}, this);
};


/**
 * Loop through store data.
 * @param  {Function} cb   
 * @param  {[type]}   scope 
 * @api public
 */

Store.prototype.loop = function(cb, scope) {
	each(this.data, cb, scope || this);
};


/**
 * Synchronize with local storage.
 * 
 * @param  {String} name 
 * @param  {Boolean} bool save in localstore
 * @api public
 */

Store.prototype.local = function(name, bool) {
	//TODO: should we do a clear for .local()?
	if(!bool) {
		storage.setItem(name, this.toJSON());
	} else {
		this.reset(JSON.parse(storage.getItem(name)));
	}
	//TODO: should we return this?
};


/**
 * Use middlewares to extend store.
 * A middleware is a function with the store
 * as first argument.
 * 
 * @param  {Function} fn 
 * @return {this}
 * @api public
 */

Store.prototype.use = function(fn) {
	fn(this);
	return this;
};


/**
 * Stringify model
 * @return {String} json
 * @api public
 */

Store.prototype.toJSON = function() {
	return JSON.stringify(this.data);
};

//TODO: localstorage middleware like

});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("bredele-artery/index.js", function(exports, require, module){

/**
 * Modules dependencies. 
 */

var App = require('./lib/app'),
 mixin = function(to, from) {
 	for (var key in from) {
 		if (from.hasOwnProperty(key)) {
 			to[key] = from[key];
 		}
 	}
 	return to;
 };


var cache = [];


/**
 * Expose artery()
 */

module.exports = artery;


/**
 * Create a artery application.
 *
 * @return {Object}
 * @api public
 */

function artery() {
	var app = new App();
	for(var i = 0, l = cache.length; i < l; i++) {
		mixin(app, cache[i]);
	}
	return app;
}


/**
 * Merge every application with passed object.
 * It can be really useful to extend the api (ex:superagent)
 * 
 * @param  {Object} obj 
 * @api public
 */

artery.merge = function() {
	cache = [].slice.call(arguments);
	return this;
};
});
require.register("bredele-artery/lib/app.js", function(exports, require, module){

/**
 * Module dependencies
 */

var Store = require('store'),
    Emitter = require('emitter');


//global artery emitter

var emitter = new Emitter();


/**
 * Expose 'App'
 */

module.exports = App;


/**
 * Application prototype
 */

function App(name) {
	//TODO: see if we should pass constructor parameters
	this.name = name || "";
	this.sandbox = new Store();
}


/**
 * Listen events on communication bus.
 *
 * Example:
 *
 *     app.on('auth/login', fn);
 *
 * @param {String} name
 * @param {Function} fn 
 * @return {app} 
 */

App.prototype.on = function(){
	return emitter.on.apply(emitter, arguments);
};


/**
 * Emit event on communication bus.
 * 
 * Example:
 *
 *     app.emit('login', true);
 *
 * @param {String} name
 * @return {app}
 */

App.prototype.emit = function(name) {
	var args = [this.name + '/' + name].concat([].slice.call(arguments, 1));
	return emitter.emit.apply(emitter, args);
};


/**
 * Listen events once on communication bus.
 *
 * @param {String} name
 * @param {Function} fn 
 * @return {app} 
 */

App.prototype.once = function() {
	return emitter.once.apply(emitter, arguments);
};


/**
 * Remove event listener on communication bus.
 *
 * Example:
 *
 *     app.off('auth/login', fn);
 *
 * @param {String} name
 * @param {Function} fn 
 * @return {app} 
 */

App.prototype.off = function() {
	return emitter.off.apply(emitter, arguments);
};


/**
 * Init handler.
 * 
 * Example:
 *
 *     app.init(); //emit init event
 *     app.init(fn); //register init callback
 *     
 * @param  {Function} fn 
 * @api public
 */

App.prototype.init = function(fn) {
	//TODO: should we have scope?
	if(fn) return this.sandbox.on('init', fn);
	this.sandbox.emit('init');
};


/**
 * Proxy to intialize other quick apps.
 *
 * @param {String} name
 * @param {Function|App} fn 
 * @return {app} for chaning api
 * @api public
 */

App.prototype.use = function(name, fn) {
	//function middleware
	if(typeof name === 'function') {
		name.call(null, this);
	}
	
	//artery app
	if(fn && fn.use) { //what defined an app?
		fn.name = name; //TODO: should we test that name is a string?
		fn.sandbox.emit('init'); //TODO: should we do once?
		this.sandbox.emit('init ' + fn.name); //we could use %s
	}
};


/**
 * Configuration handler (setter/getter).
 *
 * Example:
 *
 *     app.config(); //return config data
 *     app.config({type:'app'}); //set config data
 *     app.config('type', 'worker'); //set config prop
 *     app.config('type'); //get config prop
 *     
 * @api public
 */

App.prototype.config = function(key, value) {
	//we could save the config in localstore
	if(!key) return this.sandbox.data;
	if(typeof key === 'object') {
		this.sandbox.reset(key);
		return;
	}
	if(!value) return this.sandbox.get(key);
	this.sandbox.set(key, value);
};


// App.prototype.worker = function() {
// 	//initialize an app inside a web worker
// };


App.prototype.debug = function() {
	//common debug bus
};
});
require.register("bredele-supplant/index.js", function(exports, require, module){
var indexOf = require('indexof'),
    trim = require('trim'),
    re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;


var cache = {};


function props(str) {
  //benchmark with using match and uniq array
  var arr = [];
  str.replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
    .replace(/[a-zA-Z_]\w*/g, function(expr) {
      if(!~indexOf(arr, expr)) arr.push(expr);
    });
  return arr;
}


function fn(_) {
  return 'model.' + _;
}


function map(str) {
  var arr = props(str);
  return str.replace(re, function(_){
    if ('(' == _[_.length - 1]) return fn(_);
    if (!~indexOf(arr, _)) return _;
    return fn(_);
  });
}


/**
 * Scope statement with object.
 * 
 * @param  {string} statement
 * @return {Function}         
 */

function scope(str) {
  return new Function('model', 'return ' + map(str));
}



/**
 * Variable substitution on the string.
 *
 * @param {String} str
 * @param {Object} model
 * @return {String} interpolation's result
 */

 module.exports = function(text, model){
	//TODO:  cache the function the entire text or just the expression?
  return text.replace(/\{\{([^}]+)\}\}/g, function(_, expr) {
  	if(/[.'[+(]/.test(expr)) {
  		var fn = cache[expr] = cache[expr] || scope(expr);
  		return fn(model) || '';
  	}
    return model[trim(expr)] || '';
  });
};


module.exports.attrs = function(text) {
  var exprs = [];
  text.replace(/\{\{([^}]+)\}\}/g, function(_, expr){
    var val = trim(expr);
    if(!~indexOf(exprs, val)) exprs = exprs.concat(props(val));
  });
  return exprs;
};
});
require.register("component-indexof/index.js", function(exports, require, module){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("component-trim/index.js", function(exports, require, module){

exports = module.exports = trim;

function trim(str){
  if (str.trim) return str.trim();
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  if (str.trimLeft) return str.trimLeft();
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  if (str.trimRight) return str.trimRight();
  return str.replace(/\s*$/, '');
};

});
require.register("bredele-binding/index.js", function(exports, require, module){
var Store = require('store'),
    trim = require('trim'),
    indexOf = require('indexof'),
    supplant = require('supplant');


/**
 * Expose 'Binding'
 */

module.exports = Binding;


/**
 * Binding constructor.
 * 
 * @api public
 */

function Binding(model) {
  if(!(this instanceof Binding)) return new Binding(model);
  this.data(model);
  this.plugins = {};
  this.listeners = [];
}

//TODO: this is for view, instead doing this.binding.model = new Store();
//should we keep this or not?

Binding.prototype.data = function(data) {
  this.model = new Store(data);
  return this;
};


//todo: make better parser and more efficient
function parser(str) {
  //str = str.replace(/ /g,'');
  var phrases = str ? str.split(';') : ['main'];
  var results = [];
  for(var i = 0, l = phrases.length; i < l; i++) {
    var expr = phrases[i].split(':');

    var params = [];
    var name = expr[0];

    if(expr[1]) {
      var args = expr[1].split(',');
      for(var j = 0, h = args.length; j < h; j++) {
        params.push(trim(args[j]));
      }
    } else {
      name = 'main'; //doesn't do anything
    }

    results.push({
      method: trim(expr[0]),
      params: params
    });
  }
  return results;
}


/**
 * Bind object as function.
 * 
 * @api private
 */

function binder(obj) {
  var fn = function(el, expr) {
    var formats = parser(expr);
    for(var i = 0, l = formats.length; i < l; i++) {
      var format = formats[i];
      format.params.splice(0, 0, el);
      obj[format.method].apply(obj, format.params);
    }
  };
  //TODO: find something better
  fn.destroy = function() {
    obj.destroy && obj.destroy();
  };
  return fn;
}


/**
 * Add binding by name
 * 
 * @param {String} name  
 * @param {Object} plugin 
 * @return {Binding}
 * @api public
 */

Binding.prototype.add = function(name, plugin) {
  if(typeof plugin === 'object') plugin = binder(plugin);
  this.plugins[name] = plugin;
  return this;
};


/**
 * Substitue node text with data.
 * 
 * @param  {HTMLElement} node  type 3
 * @param  {Store} store 
 * @api private
 */

Binding.prototype.text = function(node, store) {
  var text = node.nodeValue;
  //we should do {{ but it doesn't work on ie
  if(!~ indexOf(text, '{')) return;

  var exprs = supplant.attrs(text),
      handle = function() {
        //should we cache a function?
        node.nodeValue = supplant(text, store.data);
      };

  handle();

  for(var l = exprs.length; l--;) {
    this.listeners.push(store.on('change ' + exprs[l], handle));
  }
};


/**
 * Apply binding's on a single node
 * 
 * @param  {DomElement} node 
 * @api private
 */

Binding.prototype.bind = function(node) {
  var type = node.nodeType;
  //dom element
  if (type === 1) {
    var attrs = node.attributes;
    for(var i = 0, l = attrs.length; i < l; i++) {
      var attr = attrs[i],
          plugin = this.plugins[attr.nodeName];

      if(plugin) {
        plugin.call(this.model, node, attr.nodeValue);
      } else {
        this.text(attr, this.model);
      }
    }
    return;
  }
  // text node
  if (type === 3) this.text(node, this.model);
};


/**
 * Apply bindings on nested DOM element.
 * 
 * @param  {DomElement} node
 * @return {Binding}
 * @api public
 */

Binding.prototype.scan = function(node, bool) {
  if(bool) return this.query(node);
  var nodes = node.childNodes;
  this.bind(node);
  for (var i = 0, l = nodes.length; i < l; i++) {
    this.scan(nodes[i]);
  }
  return this;
};


/**
 * Query plugins and execute them.
 * 
 * @param  {Element} el 
 * @api private
 */

Binding.prototype.query = function(el) {
  //TODO: refactor
  var parent = el.parentElement;
  if(!parent) {
    parent = document.createDocumentFragment();
    parent.appendChild(el);
  }
  for(var name in this.plugins) {
    var nodes = parent.querySelectorAll('[' + name + ']');
    for(var i = 0, l = nodes.length; i < l; i++) {
      var node = nodes[i];
      this.plugins[name].call(this.model, node, node.getAttribute(name));
    }
  }
};


/**
 * Destroy binding's plugins and unsubscribe
 * to emitter.
 * 
 * @api public
 */

Binding.prototype.remove = function() {
  for(var l = this.listeners.length; l--;) {
    var listener = this.listeners[l];
    this.model.off(listener[0],listener[1]);
  }

  for(var name in this.plugins) {
    var plugin = this.plugins[name];
    plugin.destroy && plugin.destroy();
  }
};

});
require.register("bredele-brick/index.js", function(exports, require, module){
var Store = require('store'),
		binding = require('binding'),
		each = require('each');


/**
 * Expose 'Lego'
 */

module.exports = Brick;


/**
 * Brick constructor.
 * example:
 * 
 *   var lego = require('lego');
 *   
 *   lego('<span>lego</span>');
 *   lego('<span>{{ label }}</span>', {
 *     label: 'lego'
 *   });
 *
 * @event 'before ready'
 * @event 'ready' 
 * @api public
 */

function Brick(tmpl, data) {
 if(!(this instanceof Brick)) return new Brick(tmpl, data);
 this.data = data || {};

 //refactor binding
 this.bindings = binding();
 this.bindings.model = this;

 this.formatters = {}; //do we need formatters?
 this.el = null;
 this.dom(tmpl);
 this.once('before inserted', function(bool) {
 	this.emit('before ready');
 	this.bindings.scan(this.el, bool);
 	this.emit('ready');
 }, this);
}


//mixin

for (var key in Store.prototype) {
  Brick.prototype[key] = Store.prototype[key];
}


/**
 * Add attribure binding.
 * example:
 *
 *   view.add('on', event(obj));
 *   view.add({
 *     'on' : event(obj).
 *     'repeat' : repeat()
 *   });
 *   
 * @param {String|Object} name
 * @param {Function} plug 
 * @return {Brick}
 * @api public
 */

Brick.prototype.add = function(name, plug) {
	if(typeof name !== 'string') {
		each(name, this.add, this);
	} else {
		this.bindings.add(name, plug);
		if(plug.init) plug.init(this);
	}
	return this;
};


/**
 * Render template into dom.
 * example:
 *
 *   view.dom('<span>lego</span>');
 *   view.dom(dom);
 *   
 * @param  {String|Element} tmpl
 * @return {Brick}
 * @event 'rendered' 
 * @api public
 */

Brick.prototype.dom = function(tmpl) {
	if(typeof tmpl === 'string') {
		var div = document.createElement('div');
		div.insertAdjacentHTML('beforeend', tmpl);
		this.el = div.firstChild;
	} else {
		this.el = tmpl;
	}
	this.emit('rendered');
	return this;
};


/**
 * Substitute variable and apply
 * attribute bindings.
 * example:
 *
 *    view.build();
 *    view.build(el);
 *
 *    //only apply attribute bindings
 *    view.build)(el, true);
 *    
 * @param  {Element} parent
 * @param {Boolean} query
 * @return {Brick}
 * @event 'before inserted'
 * @event 'inserted' 
 * @api public
 */

Brick.prototype.build = function(parent, query) {
	if(this.el) {
		this.emit('before inserted', query); //should we pass parent?
		if(parent) {
			parent.appendChild(this.el); //use cross browser insertAdjacentElement
			this.emit('inserted');
		}
	}
	return this;
};


/**
 * Remove attribute bindings, store
 * listeners and remove dom.
 * 
 * @return {Brick}
 * @event 'before removed'
 * @event 'removed' 
 * @api public
 */

Brick.prototype.remove = function() {
	var parent = this.el.parentElement;
	this.emit('before removed');
	this.bindings.remove();
	if(parent) {
			//this.emit('removed');
			parent.removeChild(this.el);
	}
	this.emit('removed');
	return this;
};

//partials, directive

});
require.register("bredele-lego/index.js", function(exports, require, module){

/**
 * Expose 'Mod'
 */

exports = module.exports = require('brick');

exports.box = require('artery');
});
require.register("bredele-repeat-brick/index.js", function(exports, require, module){
var binding = require('binding'),
    Store = require('store'),
    each = require('each'),
    index = require('indexof');



/**
 * Expose 'List'
 */

module.exports = List;


/**
 * List constructor.
 * 
 * @param {HTMLelement} el
 * @param {Object} model
 * @api public
 */

function List(store){
  if(!(this instanceof List)) return new List(store);
  //TODO: should mixin store
  // this.store = new Store(store);
  this.store = store;
  this.items = [];
}


/**
 * Bind HTML element with store.
 * Takes the first child as an item renderer.
 * 
 * @param  {HTMLElement} node 
 * @api public
 */

List.prototype.main =  
List.prototype.list = function(node) {
  var first = node.children[0],
      _this = this;

  this.node = node;
  this.clone = first.cloneNode(true);
  node.removeChild(first);


  this.store.on('change', function(key, value){
    var item = _this.items[key];
    if(item) {
      //NOTE: should we unbind in store when we reset?
      item.reset(value); //do our own emitter to have scope
    } else {
      //create item renderer
      _this.addItem(key, value);
    }
  });

  this.store.on('deleted', function(key, idx){
    _this.delItem(idx);
  });

  this.store.loop(this.addItem, this);
};

/**
 * Return index of node in list.
 * @param  {HTMLelement} node 
 * @return {Number}  
 * @api public
 */

List.prototype.indexOf = function(node) {
  return index(this.node.children, node);
};


/**
 * Loop over the list items.
 * Execute callback and pass store item.
 * 
 * @param  {Function} cb    
 * @param  {Object}   scope 
 * @api public
 */

List.prototype.loop = function(cb, scope) {
  each(this.items, function(idx, item){
    cb.call(scope, item.store);
  });
};


/**
 * Add list item.
 * 
 * @param {Object} obj
 * @api public
 */

List.prototype.add = function(obj) {
  //store push?
  //in the future, we could use a position
  this.store.set(this.store.data.length, obj);
};


/**
 * Set list item.
 * 
 * @param {HTMLElement|Number} idx 
 * @param {Object} obj
 * @api public
 */

List.prototype.set = function(idx, obj) {
  if(idx instanceof Element) idx = this.indexOf(idx);  
  // if(idx instanceof HTMLElement) idx = this.indexOf(idx);
  var item = this.items[idx].store;
  each(obj, function(key, val){
    item.set(key, val);
  });
};


/**
 * Delete item(s) in list.
 * 
 * @api public
 */

List.prototype.del = function(arg, scope) {
  //we should optimize store reset
  if(arg === undefined) return this.store.reset([]);
  if(typeof arg === 'function') {
    //could we handle that with inverse loop and store loop?
    var l = this.store.data.length;
    while(l--) {
      if(arg.call(scope, this.items[l].store)){
        this.store.del(l);
      }
    }
  }

  //ie8 doesn't support HTMLElement and instanceof with left assignment != object
  this.store.del(typeof arg === 'number' ? arg : this.indexOf(arg));
  //this.store.del(arg instanceof HTMLElement ? this.indexOf(arg): arg);
};


/**
 * Create item renderer from data.
 * @param  {Object} data 
 * @api private
 */

List.prototype.addItem = function(key, data) {
  var item = new ItemRenderer(this.clone, data);
  this.items[key] = item;
  this.node.appendChild(item.dom);
};


/**
 * Delete item.
 * @param  {Number} idx index
 * @api private
 */

List.prototype.delItem = function(idx) {
    var item = this.items[idx];
    item.unbind(this.node);
    this.items.splice(idx, 1);
    item = null; //for garbage collection
};


/**
 * Item renderer.
 * Represents the item that going to be repeated.
 * @param {HTMLElement} node 
 * @param {Store} data 
 * @api private
 */

function ItemRenderer(node, data){
  //NOTE: is it more perfomant to work with string?
  this.dom = node.cloneNode(true);
  this.store = new Store(data);
  this.binding = binding(this.store); //we have to have a boolean parameter to apply interpolation &|| plugins
  this.binding.scan(this.dom);
}


/**
 * Unbind an item renderer from its ancestor.
 * @param  {HTMLElement} node 
 * @api private
 */

ItemRenderer.prototype.unbind = function(node) {
  //NOTE: is there something else to do to clean the memory?
  this.store.off();
  node.removeChild(this.dom);
};


/**
 * Reset iten renderer.
 * @param  {Object} data 
 * @api private
 */

ItemRenderer.prototype.reset = function(data) {
  this.store.reset(data);
};


});
require.register("bredele-domstack/index.js", function(exports, require, module){
var indexOf = require('indexof');


/**
 * Expose 'Stack'
 */

module.exports = Stack;


/**
 * Initialize a new Stack
 *
 * @param {DomElement} parent the DOM element to stack
 * @param {DomElement} doc optional document's fragment parent
 * @api public
 */

function Stack(parent, doc) {
  this.parent = parent;
  //TODO:set document
  this.fragment = document.createDocumentFragment();
  this.directory = [];
  this.current = null;
}


/**
 * Add dom in stack.
 *
 * @param {String} dom name
 * @param {DomElement} dom element
 * @param {Boolean} current visible dom (optional)
 * @api public
 */

Stack.prototype.add = function(name, dom, bool) {
  if(!bool) {
    this.directory.push(name);
    this.fragment.appendChild(dom);
    return this;
  }
  
  if(this.current) {
    this.add(this.current[0], this.current[1]);
  }
  this.current = [name, dom];
  return this;
};


/**
 * Set visible element from stack.
 *
 * @param {String} [name] dom name
 * @api public
 */

Stack.prototype.show = function(name) {
  var index = indexOf(this.directory, name);
  if(index > -1) {
    var dom = this.fragment.childNodes[index];
    this.parent.appendChild(dom);
    this.directory.splice(index, 1);

    this.add(name, dom, true);
  }
  return this;
};


});
require.register("component-classes/index.js", function(exports, require, module){
/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el) throw new Error('A DOM element reference is required');
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name, force){
  // classList
  if (this.list) {
    if ("undefined" !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ("undefined" !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var str = this.el.className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};

});
require.register("bredele-control-brick/index.js", function(exports, require, module){
var events = require('events-brick'),
    classes = require('classes');

/**
 * Expose 'Control'
 */

module.exports = Control;


/**
 * Control constructor.
 *
 * @param {Object} scope 
 * @param {Boolean} isTouch
 * @api public
 */

function Control(scope, touch) {
	if(!(this instanceof Control)) return new Control(scope, touch);
	this.events = events(null, touch);
	this.scope = scope;
	this.current = null;
}


/**
 * Parse callback string.
 * @param  {String} str 
 * @api private
 */

function parse(str){
	var props = str.replace(/\s+/g, ' ').split(' ');
	if(props.length > 1) return props;
	return ['active', props[0]];
}


/**
 * Toggle element with specified class name.
 * Default is 'active'.
 * example:
 *
 * 		.toggle(node, 'click .lego', 'popup');
 * 		.toggle(node, 'click .lego', 'red popup');
 * 		
 * @param  {Element} node    
 * @param  {String} selector
 * @param  {String} cb    
 * @param  {String} capture 
 * @api public
 */

Control.prototype.toggle = function(node, selector, cb, capture) {
	var _this = this,
			args = parse(cb);
	this.events.on(node, selector, function(target) {
		classes(target).toggle(args[0]); //we should define the class
		_this.scope[args[1]].apply(_this.scope, arguments);
	}, capture);
};


/**
 * Radio element with specified class name.
 * Default is 'active'.
 * example:
 *
 * 		.toggle(node, 'click .lego', 'popup');
 * 		.toggle(node, 'click .lego', 'red popup');
 * 		
 * @param  {Element} node    
 * @param  {String} selector
 * @param  {String} cb    
 * @param  {String} capture 
 * @api public
 */

Control.prototype.radio = function(node, selector, cb, capture) {
	var _this = this,
			args = parse(cb);
	this.events.on(node, selector, function(target) {
		if(_this.current && _this.current !== target) classes(_this.current).remove(args[0]);
		classes(target).add(args[0]);
		_this.current = target;
		_this.scope[args[1]].apply(_this.scope, arguments);
	}, capture);
};


/**
 * Destory plugin and remove all
 * event listeners.
 * 
 * @api public
 */

Control.prototype.destroy = function() {
	this.events.destroy();
};


});
require.register("bredele-search/index.js", function(exports, require, module){

/**
 * Expose 'search'
 */

module.exports = Search;


/**
 * Search constructor.
 * @param {String} namespace
 * @api public
 */

function Search(namespace){
  this.namespace = namespace || "search";
  this.style = document.createElement('style');
  document.head.appendChild(this.style);
}


/**
 * Run search.
 * @param {String} value
 * @param {string} className
 * @api public
 */

Search.prototype.run = function(value, className) {
  var searchable = className || 'searchable';
  var query = "";
  if(value) {
    query = "." + searchable + ":not([data-search*=\'" + value + "']) { display: none; }";
  }
  this.style.innerHTML = query;
};
});
require.register("bredele-event/index.js", function(exports, require, module){

/**
 * Polyfill
 */

var attach = window.addEventListener ? 'addEventListener' : 'attachEvent',
		detach = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
		prefix = attach !== 'addEventListener' ? 'on' : '',
		indexOf = require('indexof');

/**
 * Matches query selection.
 * 
 * @param  {HTMLElement} el 
 * @param  {HTMLElement} target  
 * @param  {String} selector 
 * @return {Boolean}  true if the element would be selected by the 
 * specified selector string
 */

function matches(el, target, selector) {
	return indexOf([].slice.call(el.querySelectorAll(selector)), target) > -1 ;
}


module.exports = event;


/**
 * Attach Event Listener.
 * 
 * @param  {HTMLElement}   el
 * @param  {String}   str
 * @param  {Function} fn 
 * @param  {Boolean}   capture
 * @return {Array} handler to detach event      
 */

function event(el, str, fn, capture) {
	var filter = str.split('>'),
			phrase = filter[0].split(' '),
			topic = phrase.shift(),
			selector = phrase.join(' ');

	//TODO: do that globally?
	var cb = function(ev) {
		var target = ev.target || ev.srcElement;
		if(!selector || matches(el, target, selector)) {
			var code = filter[1] && filter[1].replace(/ /g,'');
			if(!code || ev.keyCode.toString() === code) fn(target, ev);
		}
	};

	el[attach](prefix + topic, cb, capture || false);
	return [topic, cb, capture];
}


/**
 * Detach event listener.
 * 
 * @param  {HTMLElement}   el
 * @param  {String}   str
 * @param  {Function} fn
 * @param  {Boolean}   capture   
 */

event.off = function(el, str, fn, capture) {
	el[detach](prefix + str, fn, capture || false);
};

});
require.register("bredele-events-brick/index.js", function(exports, require, module){
/**
 * Dependencies
 */

var ev = require('event');

/**
 * Map touch events.
 * @type {Object}
 * @api private
 */

var mapper = {
	'click' : 'touchend',
	'mousedown' : 'touchstart',
	'mouseup' : 'touchend',
	'mousemove' : 'touchmove'
};


/**
 * Expose 'Event plugin'
 */

module.exports = Events;


/**
 * Event plugin constructor
 * @param {Object} view event plugin scope
 * @param {Boolean} isTouch optional
 * @api public
 */

function Events(view, isTouch){
  if(!(this instanceof Events)) return new Events(view, isTouch);
  this.view = view;
  this.listeners = [];
  this.isTouch = isTouch || (window.ontouchstart !== undefined);
}



/**
 * Listen events.
 * @param {HTMLElement} node 
 * @param {String} type event's type
 * @param {String} fn view's callback name
 * @param {String} capture useCapture
 * @api private
 */

Events.prototype.on = function(node, type, fn, capture) {
  var _this = this,
     cb = function(target, e) {
      _this.view[fn].call(_this.view, target, e, node); //we should pass target
     };
  //todo: event should return the node as well...it's too complicated
  this.listeners
    .push([node].concat(ev(node, type, (typeof fn === 'function') ? fn : cb, (capture === 'true'))));
};



/**
 * Map events (desktop and mobile)
 * @param  {String} type event's name
 * @return {String} mapped event
 */

Events.prototype.map = function(type) {
	return this.isTouch ? (mapper[type] || type) : type;
};


/**
 * Remove all listeners.
 * @api public
 */

Events.prototype.destroy = function() {
  for(var l = this.listeners.length; l--;) {
    var listener = this.listeners[l];
    ev.off(listener[0], listener[1], listener[2], listener[3]);
  }
  this.listeners = [];
};


});
require.register("bredele-input-brick/index.js", function(exports, require, module){
var ev = require('event');

/**
 * Expose 'input-brick'
 */

module.exports = model;

function model(node, expr) {
	var view = this;
	ev(node, 'input', function(node) {
		view.set(expr, node.value);
	});
};


//WE should destroy the listener
// model.destroy = function() {

// };
});
require.register("hello/index.js", function(exports, require, module){
//dependencies

var lego = require('lego');
var html = require('./hello.html');

var app = lego.box();

//create view

var view = lego(html, {
	color: 'red',
	label: 'Hello World!'
});


//add model brick

view.add('model', require('input-brick'));

//insert view into body

view.build();

//export

module.exports = app;
module.exports.el = view.el;
module.exports.description = require('./description.html');


app.on('console/hello', function(arg) {
	view.set(arg[0], arg[1]);
});
});
require.register("stress/index.js", function(exports, require, module){
//dependencies

var lego = require('lego');
var html = require('./stress.html');

var app = lego.box();

//create view

var view = lego(html, {
	color: 'red'
});

var anchor = view.el.querySelector('.brick');
for(var l = 1000; l--;) {
	anchor.insertAdjacentHTML('beforeend', '<span>{{ label }}</span>');
}

//add model brick

view.add('model', require('input-brick'));

//insert view into body

view.build();

//export

module.exports = app;
module.exports.el = view.el;
module.exports.description = require('./description.html');



});
require.register("computed/index.js", function(exports, require, module){
//dependencies

var lego = require('lego');
var html = require('./computed.html');

var app = lego.box();

//create view

var view = lego(html, {
	repo: 'lego',
	github: 'bredele',
	firstName: '',
	lastName: ''
});


//create computed property

view.compute('name', function() {
	return this.firstName + ' ' + this.lastName;
});

//add events brick

view.add('model', require('input-brick'));

//insert view into body

view.build();

//export

module.exports = app;
module.exports.el = view.el;
module.exports.description = require('./description.html');
});
require.register("expressions/index.js", function(exports, require, module){
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
module.exports.description = require('./description.html');
});
require.register("bredele-hidden-brick/index.js", function(exports, require, module){
var classes = require('classes');


function toggle(node, val) {
	if(val) {
		classes(node).remove('hidden');
	} else {
		classes(node).add('hidden');
	}
}

/**
 * Conditionally add 'hidden' class.
 * @param {HTMLElement} node 
 * @param {String} attr model's attribute
 * @api public
 */

module.exports = function(node, attr) {
	var bool = (attr[0] === '!');
	if(bool) attr = attr.substring(1);
	this.on('change ' + attr, function(val) {
		toggle(node, bool ? !val : val);
	});
};

});
require.register("todo/index.js", function(exports, require, module){
//dependencies

var lego = require('lego'),
    html = require('./todo.html'),
    list = require('repeat-brick'),
    Store = require('store');

var app = lego.box();

//init

var view = lego(html, {
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
});
require.register("console/index.js", function(exports, require, module){
//dependencies

var lego = require('lego'),
		trim = require('trim');

var html = require('./console.html');

//global to test
var shell = lego.box();

//create view

var view = lego(html, []);
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



});
require.register("home/index.js", function(exports, require, module){

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
//LEGO should have convenient handler to avoid that
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

var caret = lego('<div class="indicator"><span></span></div>');

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
});
require.register("home/examples.js", function(exports, require, module){

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
});





























require.register("hello/hello.html", function(exports, require, module){
module.exports = '<div class="tmpl">\n	<style>\n	  .brick {\n	  	color: {{ color }};\n	  	margin-left: 40px;\n	  }\n	</style>\n	<input type="text" model="label" value="Hello World!">\n	<span class="brick">{{ label }}</span>\n</div>\n';
});
require.register("hello/description.html", function(exports, require, module){
module.exports = '<p>Let\'s start with the famous hello world! <a href="http://github.com/bredele/lego">Lego</a> allows you to substitute variables into a template string or a dom element as following:</p>\n<pre><code class="lang-html">&lt;div class="lego"&gt;\n    &lt;style&gt;\n      .brick {\n          color: {{ color }};\n      }\n    &lt;/style&gt;\n    &lt;span class="brick"&gt;{{ label }}&lt;/span&gt;\n&lt;/div&gt;\n</code></pre>\n<p>Nothing more simple! </p>\n<pre><code class="lang-js">var view = lego(tmpl).build();\nview.set(\'label\', \'Hello\');\n</code></pre>\n<blockquote>\n<p><strong>Tips</strong>: type <strong><code>hello color blue</code></strong> or <strong><code>hello label world</code></strong> in the console to update the demo!</p>\n</blockquote>\n';
});
require.register("stress/stress.html", function(exports, require, module){
module.exports = '<div class="lego">\n	<input type="text" model="label" value="Hello World">\n	<div class="brick"></div>\n</div>\n';
});
require.register("stress/description.html", function(exports, require, module){
module.exports = '<p>Let\'s stress the <code>Hello World!</code> demo a bit.\nIn this example, everytime you will type something it will update smoothly 1000 items in the same time.\nGo on, let\'s try it! </p>';
});
require.register("computed/computed.html", function(exports, require, module){
module.exports = '<div class="computed">\n	<p>\n		This is an example by <a href="http://github.com/{{github}}/{{repo}}">{{github}}</a>\n	</p>\n	Please enter your <input type="text" value="first name" model="firstName"> and your <input type="text" value="last name" model="lastName">\n	Welcome <span>{{name}}</span>\n</div>';
});
require.register("computed/description.html", function(exports, require, module){
module.exports = '<p>In <a href="http://github.com/bredele/lego">lego</a> you can compute properties in two ways:</p>\n<pre><code class="lang-html">&lt;span&gt;{{ firstName + \' \' + lastName }}&lt;/span&gt;\n</code></pre>\n<p>or</p>\n<pre><code class="lang-js">view.compute(\'name\', function() {\n    return this.firstName + \' \' + this.lastName;\n});\n</code></pre>';
});
require.register("expressions/expressions.html", function(exports, require, module){
module.exports = '<span>The string <code>{{ random }}</code> has {{ random.length }} character{{ random.length > 1 ? \'s\' : \'\'}}</span>';
});
require.register("expressions/description.html", function(exports, require, module){
module.exports = '<p>Expressions in <a href="http://github.com/bredele/lego">lego</a> are a strict subset of the JavaScript language. You can use logical operators, paths, etc.\n</p>\n<p>Here\'s an example:</p>\n<pre><code class="lang-html"><span>The string {{label}} has {{ label.length }} character {{ label.length !== 1 ? \'s\' : \'\' }}</span>\n</code></pre>';
});

require.register("todo/todo.html", function(exports, require, module){
module.exports = '<section id="todoapp">\n  <header id="header">\n    <input id="new-todo" placeholder="What needs to be done?" events="on:keypress > 13,add" autofocus>\n  </header>\n  <section id="main">\n    <input id="toggle-all" type="checkbox" events="on:click,toggleAll">\n    <label for="toggle-all">Mark all as complete</label>\n    <ul id="todo-list" events="on: click .toggle,toggle;on:click .destroy,del;on:dbclick .label,edit" todos>\n      <li class="{{ status }}">\n        <input class="toggle" type="checkbox">\n        <label class="label">{{ label }}</label>\n        <button class="destroy"></button>\n      </li>\n    </ul>\n  </section>\n  <footer id="footer" class="hidden" visible="items">\n    <span id="todo-count">\n      <strong>{{ \'\' + pending }}</strong> \n      item{{ pending !== 1 ? \'s\' : \'\' }} left\n    </span>\n    <button id="clear-completed" events="on:click,delAll" class="{{ completed ? \'\' : \'hidden\' }}">\n      Clear completed ({{ completed }})\n    </button>\n  </footer>\n</section>';
});
require.register("todo/description.html", function(exports, require, module){
module.exports = '<p>This example is a fork of the famous <a href="http://todomvc.com/">Todo MVC</a> and is probably one of the <a href="https://github.com/bredele/lego-examples/tree/master/src/todos">smallest</a> and fastest. In average, it is 22 times faster than Backbone.</p>\n<blockquote>\n<p><strong>Tips</strong>: type <strong><code>todo 200 foo</code></strong> in the console to create 200 items with the label foo. The console will print the benchmark score.</p>\n</blockquote>';
});
require.register("console/console.html", function(exports, require, module){
module.exports = '<div class="console">\n	<section class="editorWrap">\n		<div class="editor animate fadeIn">\n			<div class="menu"></div><!-- end .menu -->\n			<div class="code">\n				<input class="text" ev="on:keypress > 13, send" placeholder="Type something!">\n				<ul class="logs" logs>\n					<p>{{log}}</p>\n				</ul>\n			</div>\n		</div>\n	</section>	\n	<p>&nbsp;</p>	\n</div>';
});
require.alias("home/index.js", "lego-examples/deps/Home/index.js");
require.alias("home/examples.js", "lego-examples/deps/Home/examples.js");
require.alias("home/index.js", "lego-examples/deps/Home/index.js");
require.alias("home/index.js", "Home/index.js");
require.alias("bredele-lego/index.js", "home/deps/lego/index.js");
require.alias("bredele-lego/index.js", "home/deps/lego/index.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-artery/lib/app.js", "bredele-lego/deps/artery/lib/app.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-emitter/index.js", "bredele-artery/deps/emitter/index.js");

require.alias("bredele-artery/index.js", "bredele-artery/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("component-indexof/index.js", "bredele-supplant/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-supplant/deps/trim/index.js");

require.alias("bredele-supplant/index.js", "bredele-supplant/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-indexof/index.js", "bredele-binding/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-binding/deps/trim/index.js");

require.alias("bredele-binding/index.js", "bredele-binding/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-brick/index.js", "bredele-brick/index.js");
require.alias("bredele-lego/index.js", "bredele-lego/index.js");
require.alias("bredele-repeat-brick/index.js", "home/deps/repeat-brick/index.js");
require.alias("bredele-repeat-brick/index.js", "home/deps/repeat-brick/index.js");
require.alias("bredele-binding/index.js", "bredele-repeat-brick/deps/binding/index.js");
require.alias("bredele-binding/index.js", "bredele-repeat-brick/deps/binding/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("component-indexof/index.js", "bredele-supplant/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-supplant/deps/trim/index.js");

require.alias("bredele-supplant/index.js", "bredele-supplant/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-indexof/index.js", "bredele-binding/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-binding/deps/trim/index.js");

require.alias("bredele-binding/index.js", "bredele-binding/index.js");
require.alias("bredele-store/index.js", "bredele-repeat-brick/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-repeat-brick/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-indexof/index.js", "bredele-repeat-brick/deps/indexof/index.js");

require.alias("bredele-each/index.js", "bredele-repeat-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-repeat-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-repeat-brick/index.js", "bredele-repeat-brick/index.js");
require.alias("bredele-domstack/index.js", "home/deps/domstack/index.js");
require.alias("bredele-domstack/index.js", "home/deps/domstack/index.js");
require.alias("component-indexof/index.js", "bredele-domstack/deps/indexof/index.js");

require.alias("bredele-domstack/index.js", "bredele-domstack/index.js");
require.alias("bredele-control-brick/index.js", "home/deps/control-brick/index.js");
require.alias("bredele-control-brick/index.js", "home/deps/control-brick/index.js");
require.alias("bredele-events-brick/index.js", "bredele-control-brick/deps/events-brick/index.js");
require.alias("bredele-events-brick/index.js", "bredele-control-brick/deps/events-brick/index.js");
require.alias("bredele-event/index.js", "bredele-events-brick/deps/event/index.js");
require.alias("bredele-event/index.js", "bredele-events-brick/deps/event/index.js");
require.alias("component-indexof/index.js", "bredele-event/deps/indexof/index.js");

require.alias("bredele-event/index.js", "bredele-event/index.js");
require.alias("bredele-events-brick/index.js", "bredele-events-brick/index.js");
require.alias("component-classes/index.js", "bredele-control-brick/deps/classes/index.js");
require.alias("component-indexof/index.js", "component-classes/deps/indexof/index.js");

require.alias("bredele-control-brick/index.js", "bredele-control-brick/index.js");
require.alias("bredele-search/index.js", "home/deps/search/index.js");
require.alias("bredele-search/index.js", "home/deps/search/index.js");
require.alias("bredele-search/index.js", "bredele-search/index.js");
require.alias("bredele-events-brick/index.js", "home/deps/events-brick/index.js");
require.alias("bredele-events-brick/index.js", "home/deps/events-brick/index.js");
require.alias("bredele-event/index.js", "bredele-events-brick/deps/event/index.js");
require.alias("bredele-event/index.js", "bredele-events-brick/deps/event/index.js");
require.alias("component-indexof/index.js", "bredele-event/deps/indexof/index.js");

require.alias("bredele-event/index.js", "bredele-event/index.js");
require.alias("bredele-events-brick/index.js", "bredele-events-brick/index.js");
require.alias("hello/index.js", "home/deps/hello/index.js");
require.alias("hello/index.js", "home/deps/hello/index.js");
require.alias("bredele-lego/index.js", "hello/deps/lego/index.js");
require.alias("bredele-lego/index.js", "hello/deps/lego/index.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-artery/lib/app.js", "bredele-lego/deps/artery/lib/app.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-emitter/index.js", "bredele-artery/deps/emitter/index.js");

require.alias("bredele-artery/index.js", "bredele-artery/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("component-indexof/index.js", "bredele-supplant/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-supplant/deps/trim/index.js");

require.alias("bredele-supplant/index.js", "bredele-supplant/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-indexof/index.js", "bredele-binding/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-binding/deps/trim/index.js");

require.alias("bredele-binding/index.js", "bredele-binding/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-brick/index.js", "bredele-brick/index.js");
require.alias("bredele-lego/index.js", "bredele-lego/index.js");
require.alias("bredele-input-brick/index.js", "hello/deps/input-brick/index.js");
require.alias("bredele-input-brick/index.js", "hello/deps/input-brick/index.js");
require.alias("bredele-event/index.js", "bredele-input-brick/deps/event/index.js");
require.alias("bredele-event/index.js", "bredele-input-brick/deps/event/index.js");
require.alias("component-indexof/index.js", "bredele-event/deps/indexof/index.js");

require.alias("bredele-event/index.js", "bredele-event/index.js");
require.alias("bredele-input-brick/index.js", "bredele-input-brick/index.js");
require.alias("hello/index.js", "hello/index.js");
require.alias("stress/index.js", "home/deps/stress/index.js");
require.alias("stress/index.js", "home/deps/stress/index.js");
require.alias("bredele-lego/index.js", "stress/deps/lego/index.js");
require.alias("bredele-lego/index.js", "stress/deps/lego/index.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-artery/lib/app.js", "bredele-lego/deps/artery/lib/app.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-emitter/index.js", "bredele-artery/deps/emitter/index.js");

require.alias("bredele-artery/index.js", "bredele-artery/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("component-indexof/index.js", "bredele-supplant/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-supplant/deps/trim/index.js");

require.alias("bredele-supplant/index.js", "bredele-supplant/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-indexof/index.js", "bredele-binding/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-binding/deps/trim/index.js");

require.alias("bredele-binding/index.js", "bredele-binding/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-brick/index.js", "bredele-brick/index.js");
require.alias("bredele-lego/index.js", "bredele-lego/index.js");
require.alias("bredele-input-brick/index.js", "stress/deps/input-brick/index.js");
require.alias("bredele-input-brick/index.js", "stress/deps/input-brick/index.js");
require.alias("bredele-event/index.js", "bredele-input-brick/deps/event/index.js");
require.alias("bredele-event/index.js", "bredele-input-brick/deps/event/index.js");
require.alias("component-indexof/index.js", "bredele-event/deps/indexof/index.js");

require.alias("bredele-event/index.js", "bredele-event/index.js");
require.alias("bredele-input-brick/index.js", "bredele-input-brick/index.js");
require.alias("stress/index.js", "stress/index.js");
require.alias("computed/index.js", "home/deps/computed/index.js");
require.alias("computed/index.js", "home/deps/computed/index.js");
require.alias("bredele-lego/index.js", "computed/deps/lego/index.js");
require.alias("bredele-lego/index.js", "computed/deps/lego/index.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-artery/lib/app.js", "bredele-lego/deps/artery/lib/app.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-emitter/index.js", "bredele-artery/deps/emitter/index.js");

require.alias("bredele-artery/index.js", "bredele-artery/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("component-indexof/index.js", "bredele-supplant/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-supplant/deps/trim/index.js");

require.alias("bredele-supplant/index.js", "bredele-supplant/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-indexof/index.js", "bredele-binding/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-binding/deps/trim/index.js");

require.alias("bredele-binding/index.js", "bredele-binding/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-brick/index.js", "bredele-brick/index.js");
require.alias("bredele-lego/index.js", "bredele-lego/index.js");
require.alias("bredele-input-brick/index.js", "computed/deps/input-brick/index.js");
require.alias("bredele-input-brick/index.js", "computed/deps/input-brick/index.js");
require.alias("bredele-event/index.js", "bredele-input-brick/deps/event/index.js");
require.alias("bredele-event/index.js", "bredele-input-brick/deps/event/index.js");
require.alias("component-indexof/index.js", "bredele-event/deps/indexof/index.js");

require.alias("bredele-event/index.js", "bredele-event/index.js");
require.alias("bredele-input-brick/index.js", "bredele-input-brick/index.js");
require.alias("computed/index.js", "computed/index.js");
require.alias("expressions/index.js", "home/deps/expressions/index.js");
require.alias("expressions/index.js", "home/deps/expressions/index.js");
require.alias("bredele-lego/index.js", "expressions/deps/lego/index.js");
require.alias("bredele-lego/index.js", "expressions/deps/lego/index.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-artery/lib/app.js", "bredele-lego/deps/artery/lib/app.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-emitter/index.js", "bredele-artery/deps/emitter/index.js");

require.alias("bredele-artery/index.js", "bredele-artery/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("component-indexof/index.js", "bredele-supplant/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-supplant/deps/trim/index.js");

require.alias("bredele-supplant/index.js", "bredele-supplant/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-indexof/index.js", "bredele-binding/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-binding/deps/trim/index.js");

require.alias("bredele-binding/index.js", "bredele-binding/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-brick/index.js", "bredele-brick/index.js");
require.alias("bredele-lego/index.js", "bredele-lego/index.js");
require.alias("expressions/index.js", "expressions/index.js");
require.alias("todo/index.js", "home/deps/todo/index.js");
require.alias("todo/index.js", "home/deps/todo/index.js");
require.alias("bredele-lego/index.js", "todo/deps/lego/index.js");
require.alias("bredele-lego/index.js", "todo/deps/lego/index.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-artery/lib/app.js", "bredele-lego/deps/artery/lib/app.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-emitter/index.js", "bredele-artery/deps/emitter/index.js");

require.alias("bredele-artery/index.js", "bredele-artery/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("component-indexof/index.js", "bredele-supplant/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-supplant/deps/trim/index.js");

require.alias("bredele-supplant/index.js", "bredele-supplant/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-indexof/index.js", "bredele-binding/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-binding/deps/trim/index.js");

require.alias("bredele-binding/index.js", "bredele-binding/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-brick/index.js", "bredele-brick/index.js");
require.alias("bredele-lego/index.js", "bredele-lego/index.js");
require.alias("bredele-repeat-brick/index.js", "todo/deps/repeat-brick/index.js");
require.alias("bredele-repeat-brick/index.js", "todo/deps/repeat-brick/index.js");
require.alias("bredele-binding/index.js", "bredele-repeat-brick/deps/binding/index.js");
require.alias("bredele-binding/index.js", "bredele-repeat-brick/deps/binding/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("component-indexof/index.js", "bredele-supplant/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-supplant/deps/trim/index.js");

require.alias("bredele-supplant/index.js", "bredele-supplant/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-indexof/index.js", "bredele-binding/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-binding/deps/trim/index.js");

require.alias("bredele-binding/index.js", "bredele-binding/index.js");
require.alias("bredele-store/index.js", "bredele-repeat-brick/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-repeat-brick/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-indexof/index.js", "bredele-repeat-brick/deps/indexof/index.js");

require.alias("bredele-each/index.js", "bredele-repeat-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-repeat-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-repeat-brick/index.js", "bredele-repeat-brick/index.js");
require.alias("bredele-events-brick/index.js", "todo/deps/events-brick/index.js");
require.alias("bredele-events-brick/index.js", "todo/deps/events-brick/index.js");
require.alias("bredele-event/index.js", "bredele-events-brick/deps/event/index.js");
require.alias("bredele-event/index.js", "bredele-events-brick/deps/event/index.js");
require.alias("component-indexof/index.js", "bredele-event/deps/indexof/index.js");

require.alias("bredele-event/index.js", "bredele-event/index.js");
require.alias("bredele-events-brick/index.js", "bredele-events-brick/index.js");
require.alias("bredele-hidden-brick/index.js", "todo/deps/hidden-brick/index.js");
require.alias("bredele-hidden-brick/index.js", "todo/deps/hidden-brick/index.js");
require.alias("component-classes/index.js", "bredele-hidden-brick/deps/classes/index.js");
require.alias("component-indexof/index.js", "component-classes/deps/indexof/index.js");

require.alias("bredele-hidden-brick/index.js", "bredele-hidden-brick/index.js");
require.alias("bredele-store/index.js", "todo/deps/store/index.js");
require.alias("bredele-store/index.js", "todo/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("todo/index.js", "todo/index.js");
require.alias("console/index.js", "home/deps/console/index.js");
require.alias("console/index.js", "home/deps/console/index.js");
require.alias("bredele-lego/index.js", "console/deps/lego/index.js");
require.alias("bredele-lego/index.js", "console/deps/lego/index.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-artery/lib/app.js", "bredele-lego/deps/artery/lib/app.js");
require.alias("bredele-artery/index.js", "bredele-lego/deps/artery/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-artery/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-emitter/index.js", "bredele-artery/deps/emitter/index.js");

require.alias("bredele-artery/index.js", "bredele-artery/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-brick/index.js", "bredele-lego/deps/brick/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-binding/index.js", "bredele-brick/deps/binding/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("component-indexof/index.js", "bredele-supplant/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-supplant/deps/trim/index.js");

require.alias("bredele-supplant/index.js", "bredele-supplant/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-indexof/index.js", "bredele-binding/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-binding/deps/trim/index.js");

require.alias("bredele-binding/index.js", "bredele-binding/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-brick/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-brick/index.js", "bredele-brick/index.js");
require.alias("bredele-lego/index.js", "bredele-lego/index.js");
require.alias("bredele-events-brick/index.js", "console/deps/events-brick/index.js");
require.alias("bredele-events-brick/index.js", "console/deps/events-brick/index.js");
require.alias("bredele-event/index.js", "bredele-events-brick/deps/event/index.js");
require.alias("bredele-event/index.js", "bredele-events-brick/deps/event/index.js");
require.alias("component-indexof/index.js", "bredele-event/deps/indexof/index.js");

require.alias("bredele-event/index.js", "bredele-event/index.js");
require.alias("bredele-events-brick/index.js", "bredele-events-brick/index.js");
require.alias("bredele-repeat-brick/index.js", "console/deps/repeat-brick/index.js");
require.alias("bredele-repeat-brick/index.js", "console/deps/repeat-brick/index.js");
require.alias("bredele-binding/index.js", "bredele-repeat-brick/deps/binding/index.js");
require.alias("bredele-binding/index.js", "bredele-repeat-brick/deps/binding/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("bredele-supplant/index.js", "bredele-binding/deps/supplant/index.js");
require.alias("component-indexof/index.js", "bredele-supplant/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-supplant/deps/trim/index.js");

require.alias("bredele-supplant/index.js", "bredele-supplant/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-binding/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-indexof/index.js", "bredele-binding/deps/indexof/index.js");

require.alias("component-trim/index.js", "bredele-binding/deps/trim/index.js");

require.alias("bredele-binding/index.js", "bredele-binding/index.js");
require.alias("bredele-store/index.js", "bredele-repeat-brick/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-repeat-brick/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-indexof/index.js", "bredele-repeat-brick/deps/indexof/index.js");

require.alias("bredele-each/index.js", "bredele-repeat-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-repeat-brick/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-repeat-brick/index.js", "bredele-repeat-brick/index.js");
require.alias("component-trim/index.js", "console/deps/trim/index.js");

require.alias("console/index.js", "console/index.js");
require.alias("home/index.js", "home/index.js");