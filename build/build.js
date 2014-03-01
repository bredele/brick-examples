
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
require.register("bredele-each/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose 'each'\n\
 */\n\
\n\
module.exports = function(obj, fn, scope){\n\
  if( obj instanceof Array) {\n\
    array(obj, fn, scope);\n\
  } else if(typeof obj === 'object') {\n\
    object(obj, fn, scope);\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Object iteration.\n\
 * @param  {Object}   obj   \n\
 * @param  {Function} fn    \n\
 * @param  {Object}   scope \n\
 * @api private\n\
 */\n\
\n\
function object(obj, fn, scope) {\n\
  for (var i in obj) {\n\
    if (obj.hasOwnProperty(i)) {\n\
      fn.call(scope, i, obj[i]);\n\
    }\n\
  }\n\
}\n\
\n\
\n\
/**\n\
 * Array iteration.\n\
 * @param  {Array}   obj   \n\
 * @param  {Function} fn    \n\
 * @param  {Object}   scope \n\
 * @api private\n\
 */\n\
\n\
function array(obj, fn, scope){\n\
  for(var i = 0, l = obj.length; i < l; i++){\n\
    fn.call(scope, i, obj[i]);\n\
  }\n\
}//@ sourceURL=bredele-each/index.js"
));
require.register("bredele-clone/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose 'clone'\n\
 * @param  {Object} obj \n\
 * @api public\n\
 */\n\
\n\
module.exports = function(obj) {\n\
  var cp = null;\n\
  if(obj instanceof Array) {\n\
    cp = obj.slice(0);\n\
  } else {\n\
    //hasOwnProperty doesn't work with Object.create\n\
    // cp = Object.create ? Object.create(obj) : clone(obj);\n\
    cp = clone(obj);\n\
  }\n\
  return cp;\n\
};\n\
\n\
\n\
/**\n\
 * Clone object.\n\
 * @param  {Object} obj \n\
 * @api private\n\
 */\n\
\n\
function clone(obj){\n\
  if(typeof obj === 'object') {\n\
    var copy = {};\n\
    for (var key in obj) {\n\
      if (obj.hasOwnProperty(key)) {\n\
        copy[key] = clone(obj[key]);\n\
      }\n\
    }\n\
    return copy;\n\
  }\n\
  return obj;\n\
}//@ sourceURL=bredele-clone/index.js"
));
require.register("bredele-store/index.js", Function("exports, require, module",
"var Emitter = require('emitter'),\n\
\t\tclone = require('clone'),\n\
\t\teach = require('each'),\n\
\t\tstorage = window.localStorage;\n\
\n\
/**\n\
 * Expose 'Store'\n\
 */\n\
\n\
module.exports = Store;\n\
\n\
\n\
/**\n\
 * Store constructor\n\
 * @api public\n\
 */\n\
\n\
function Store(data) {\n\
\tif(data instanceof Store) return data;\n\
\tthis.data = data || {};\n\
\tthis.formatters = {};\n\
}\n\
\n\
\n\
Emitter(Store.prototype);\n\
\n\
/**\n\
 * Set store attribute.\n\
 * @param {String} name\n\
 * @param {Everything} value\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.set = function(name, value, plugin) { //add object options\n\
\tvar prev = this.data[name];\n\
\t//TODO: what happend if update store-object with an array and vice versa?\n\
\tif(typeof name === 'object') return each(name, this.set, this);\n\
\tif(prev !== value) {\n\
\t\tthis.data[name] = value;\n\
\t\tthis.emit('change', name, value, prev);\n\
\t\tthis.emit('change ' + name, value, prev);\n\
\t}\n\
};\n\
\n\
\n\
/**\n\
 * Get store attribute.\n\
 * @param {String} name\n\
 * @return {Everything}\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.get = function(name) {\n\
\tvar formatter = this.formatters[name];\n\
\tvar value = this.data[name];\n\
\tif(formatter) {\n\
\t\tvalue = formatter[0].call(formatter[1], value);\n\
\t}\n\
\treturn value;\n\
};\n\
\n\
/**\n\
 * Get store attribute.\n\
 * @param {String} name\n\
 * @return {Everything}\n\
 * @api private\n\
 */\n\
\n\
Store.prototype.has = function(name) {\n\
\t//NOTE: I don't know if it should be public\n\
\treturn this.data.hasOwnProperty(name);\n\
};\n\
\n\
\n\
/**\n\
 * Delete store attribute.\n\
 * @param {String} name\n\
 * @return {Everything}\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.del = function(name) {\n\
\t//TODO:refactor this is ugly\n\
\tif(this.has(name)){\n\
\t\tif(this.data instanceof Array){\n\
\t\t\tthis.data.splice(name, 1);\n\
\t\t} else {\n\
\t\t\tdelete this.data[name]; //NOTE: do we need to return something?\n\
\t\t}\n\
\t\tthis.emit('deleted', name, name);\n\
\t\tthis.emit('deleted ' + name, name);\n\
\t}\n\
};\n\
\n\
\n\
/**\n\
 * Set format middleware.\n\
 * Call formatter everytime a getter is called.\n\
 * A formatter should always return a value.\n\
 * @param {String} name\n\
 * @param {Function} callback\n\
 * @param {Object} scope\n\
 * @return this\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.format = function(name, callback, scope) {\n\
\tthis.formatters[name] = [callback,scope];\n\
\treturn this;\n\
};\n\
\n\
\n\
/**\n\
 * Compute store attributes\n\
 * @param  {String} name\n\
 * @return {Function} callback                \n\
 * @api public\n\
 */\n\
\n\
Store.prototype.compute = function(name, callback) {\n\
\t//NOTE: I want something clean instaead passing the computed \n\
\t//attribute in the function\n\
\tvar str = callback.toString();\n\
\tvar attrs = str.match(/this.[a-zA-Z0-9]*/g);\n\
\n\
\tthis.set(name, callback.call(this.data)); //TODO: refactor (may be use replace)\n\
\tfor(var l = attrs.length; l--;){\n\
\t\tthis.on('change ' + attrs[l].slice(5), function(){\n\
\t\t\tthis.set(name, callback.call(this.data));\n\
\t\t});\n\
\t}\n\
};\n\
\n\
\n\
/**\n\
 * Reset store\n\
 * @param  {Object} data \n\
 * @api public\n\
 */\n\
\n\
Store.prototype.reset = function(data) {\n\
\tvar copy = clone(this.data),\n\
\t\tlength = data.length;\n\
\t\tthis.data = data;\n\
\n\
\teach(copy, function(key, val){\n\
\t\tif(typeof data[key] === 'undefined'){\n\
\t\t\tthis.emit('deleted', key, length);\n\
\t\t\tthis.emit('deleted ' + key, length);\n\
\t\t}\n\
\t}, this);\n\
\n\
\t//set new attributes\n\
\teach(data, function(key, val){\n\
\t\t//TODO:refactor with this.set\n\
\t\tvar prev = copy[key];\n\
\t\tif(prev !== val) {\n\
\t\t\tthis.emit('change', key, val, prev);\n\
\t\t\tthis.emit('change ' + key, val, prev);\n\
\t\t}\n\
\t}, this);\n\
};\n\
\n\
\n\
/**\n\
 * Loop through store data.\n\
 * @param  {Function} cb   \n\
 * @param  {[type]}   scope \n\
 * @api public\n\
 */\n\
\n\
Store.prototype.loop = function(cb, scope) {\n\
\teach(this.data, cb, scope || this);\n\
};\n\
\n\
\n\
/**\n\
 * Synchronize with local storage.\n\
 * \n\
 * @param  {String} name \n\
 * @param  {Boolean} bool save in localstore\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.local = function(name, bool) {\n\
\t//TODO: should we do a clear for .local()?\n\
\tif(!bool) {\n\
\t\tstorage.setItem(name, this.toJSON());\n\
\t} else {\n\
\t\tthis.reset(JSON.parse(storage.getItem(name)));\n\
\t}\n\
\t//TODO: should we return this?\n\
};\n\
\n\
\n\
/**\n\
 * Use middlewares to extend store.\n\
 * A middleware is a function with the store\n\
 * as first argument.\n\
 * \n\
 * @param  {Function} fn \n\
 * @return {this}\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.use = function(fn) {\n\
\tfn(this);\n\
\treturn this;\n\
};\n\
\n\
\n\
/**\n\
 * Stringify model\n\
 * @return {String} json\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.toJSON = function() {\n\
\treturn JSON.stringify(this.data);\n\
};\n\
\n\
//TODO: localstorage middleware like\n\
//@ sourceURL=bredele-store/index.js"
));
require.register("component-emitter/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `Emitter`.\n\
 */\n\
\n\
module.exports = Emitter;\n\
\n\
/**\n\
 * Initialize a new `Emitter`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Emitter(obj) {\n\
  if (obj) return mixin(obj);\n\
};\n\
\n\
/**\n\
 * Mixin the emitter properties.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function mixin(obj) {\n\
  for (var key in Emitter.prototype) {\n\
    obj[key] = Emitter.prototype[key];\n\
  }\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Listen on the given `event` with `fn`.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.on =\n\
Emitter.prototype.addEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
  (this._callbacks[event] = this._callbacks[event] || [])\n\
    .push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Adds an `event` listener that will be invoked a single\n\
 * time then automatically removed.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.once = function(event, fn){\n\
  var self = this;\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  function on() {\n\
    self.off(event, on);\n\
    fn.apply(this, arguments);\n\
  }\n\
\n\
  on.fn = fn;\n\
  this.on(event, on);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove the given callback for `event` or all\n\
 * registered callbacks.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.off =\n\
Emitter.prototype.removeListener =\n\
Emitter.prototype.removeAllListeners =\n\
Emitter.prototype.removeEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  // all\n\
  if (0 == arguments.length) {\n\
    this._callbacks = {};\n\
    return this;\n\
  }\n\
\n\
  // specific event\n\
  var callbacks = this._callbacks[event];\n\
  if (!callbacks) return this;\n\
\n\
  // remove all handlers\n\
  if (1 == arguments.length) {\n\
    delete this._callbacks[event];\n\
    return this;\n\
  }\n\
\n\
  // remove specific handler\n\
  var cb;\n\
  for (var i = 0; i < callbacks.length; i++) {\n\
    cb = callbacks[i];\n\
    if (cb === fn || cb.fn === fn) {\n\
      callbacks.splice(i, 1);\n\
      break;\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Emit `event` with the given args.\n\
 *\n\
 * @param {String} event\n\
 * @param {Mixed} ...\n\
 * @return {Emitter}\n\
 */\n\
\n\
Emitter.prototype.emit = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  var args = [].slice.call(arguments, 1)\n\
    , callbacks = this._callbacks[event];\n\
\n\
  if (callbacks) {\n\
    callbacks = callbacks.slice(0);\n\
    for (var i = 0, len = callbacks.length; i < len; ++i) {\n\
      callbacks[i].apply(this, args);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return array of callbacks for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.listeners = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  return this._callbacks[event] || [];\n\
};\n\
\n\
/**\n\
 * Check if this emitter has `event` handlers.\n\
 *\n\
 * @param {String} event\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.hasListeners = function(event){\n\
  return !! this.listeners(event).length;\n\
};\n\
//@ sourceURL=component-emitter/index.js"
));
require.register("bredele-artery/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Modules dependencies. \n\
 */\n\
\n\
var App = require('./lib/app'),\n\
 mixin = function(to, from) {\n\
 \tfor (var key in from) {\n\
 \t\tif (from.hasOwnProperty(key)) {\n\
 \t\t\tto[key] = from[key];\n\
 \t\t}\n\
 \t}\n\
 \treturn to;\n\
 };\n\
\n\
\n\
var cache = [];\n\
\n\
\n\
/**\n\
 * Expose artery()\n\
 */\n\
\n\
module.exports = artery;\n\
\n\
\n\
/**\n\
 * Create a artery application.\n\
 *\n\
 * @return {Object}\n\
 * @api public\n\
 */\n\
\n\
function artery() {\n\
\tvar app = new App();\n\
\tfor(var i = 0, l = cache.length; i < l; i++) {\n\
\t\tmixin(app, cache[i]);\n\
\t}\n\
\treturn app;\n\
}\n\
\n\
\n\
/**\n\
 * Merge every application with passed object.\n\
 * It can be really useful to extend the api (ex:superagent)\n\
 * \n\
 * @param  {Object} obj \n\
 * @api public\n\
 */\n\
\n\
artery.merge = function() {\n\
\tcache = [].slice.call(arguments);\n\
\treturn this;\n\
};//@ sourceURL=bredele-artery/index.js"
));
require.register("bredele-artery/lib/app.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies\n\
 */\n\
\n\
var Store = require('store'),\n\
    Emitter = require('emitter');\n\
\n\
\n\
//global artery emitter\n\
\n\
var emitter = new Emitter();\n\
\n\
\n\
/**\n\
 * Expose 'App'\n\
 */\n\
\n\
module.exports = App;\n\
\n\
\n\
/**\n\
 * Application prototype\n\
 */\n\
\n\
function App(name) {\n\
\t//TODO: see if we should pass constructor parameters\n\
\tthis.name = name || \"\";\n\
\tthis.sandbox = new Store();\n\
}\n\
\n\
\n\
/**\n\
 * Listen events on communication bus.\n\
 *\n\
 * Example:\n\
 *\n\
 *     app.on('auth/login', fn);\n\
 *\n\
 * @param {String} name\n\
 * @param {Function} fn \n\
 * @return {app} \n\
 */\n\
\n\
App.prototype.on = function(){\n\
\treturn emitter.on.apply(emitter, arguments);\n\
};\n\
\n\
\n\
/**\n\
 * Emit event on communication bus.\n\
 * \n\
 * Example:\n\
 *\n\
 *     app.emit('login', true);\n\
 *\n\
 * @param {String} name\n\
 * @return {app}\n\
 */\n\
\n\
App.prototype.emit = function(name) {\n\
\tvar args = [this.name + '/' + name].concat([].slice.call(arguments, 1));\n\
\treturn emitter.emit.apply(emitter, args);\n\
};\n\
\n\
\n\
/**\n\
 * Listen events once on communication bus.\n\
 *\n\
 * @param {String} name\n\
 * @param {Function} fn \n\
 * @return {app} \n\
 */\n\
\n\
App.prototype.once = function() {\n\
\treturn emitter.once.apply(emitter, arguments);\n\
};\n\
\n\
\n\
/**\n\
 * Remove event listener on communication bus.\n\
 *\n\
 * Example:\n\
 *\n\
 *     app.off('auth/login', fn);\n\
 *\n\
 * @param {String} name\n\
 * @param {Function} fn \n\
 * @return {app} \n\
 */\n\
\n\
App.prototype.off = function() {\n\
\treturn emitter.off.apply(emitter, arguments);\n\
};\n\
\n\
\n\
/**\n\
 * Init handler.\n\
 * \n\
 * Example:\n\
 *\n\
 *     app.init(); //emit init event\n\
 *     app.init(fn); //register init callback\n\
 *     \n\
 * @param  {Function} fn \n\
 * @api public\n\
 */\n\
\n\
App.prototype.init = function(fn) {\n\
\t//TODO: should we have scope?\n\
\tif(fn) return this.sandbox.on('init', fn);\n\
\tthis.sandbox.emit('init');\n\
};\n\
\n\
\n\
/**\n\
 * Proxy to intialize other quick apps.\n\
 *\n\
 * @param {String} name\n\
 * @param {Function|App} fn \n\
 * @return {app} for chaning api\n\
 * @api public\n\
 */\n\
\n\
App.prototype.use = function(name, fn) {\n\
\t//function middleware\n\
\tif(typeof name === 'function') {\n\
\t\tname.call(null, this);\n\
\t}\n\
\t\n\
\t//artery app\n\
\tif(fn && fn.use) { //what defined an app?\n\
\t\tfn.name = name; //TODO: should we test that name is a string?\n\
\t\tfn.sandbox.emit('init'); //TODO: should we do once?\n\
\t\tthis.sandbox.emit('init ' + fn.name); //we could use %s\n\
\t}\n\
};\n\
\n\
\n\
/**\n\
 * Configuration handler (setter/getter).\n\
 *\n\
 * Example:\n\
 *\n\
 *     app.config(); //return config data\n\
 *     app.config({type:'app'}); //set config data\n\
 *     app.config('type', 'worker'); //set config prop\n\
 *     app.config('type'); //get config prop\n\
 *     \n\
 * @api public\n\
 */\n\
\n\
App.prototype.config = function(key, value) {\n\
\t//we could save the config in localstore\n\
\tif(!key) return this.sandbox.data;\n\
\tif(typeof key === 'object') {\n\
\t\tthis.sandbox.reset(key);\n\
\t\treturn;\n\
\t}\n\
\tif(!value) return this.sandbox.get(key);\n\
\tthis.sandbox.set(key, value);\n\
};\n\
\n\
\n\
// App.prototype.worker = function() {\n\
// \t//initialize an app inside a web worker\n\
// };\n\
\n\
\n\
App.prototype.debug = function() {\n\
\t//common debug bus\n\
};//@ sourceURL=bredele-artery/lib/app.js"
));
require.register("bredele-supplant/index.js", Function("exports, require, module",
"var indexOf = require('indexof'),\n\
    trim = require('trim'),\n\
    re = /\\.\\w+|\\w+ *\\(|\"[^\"]*\"|'[^']*'|\\/([^/]+)\\/|[a-zA-Z_]\\w*/g;\n\
\n\
\n\
var cache = {};\n\
\n\
\n\
function props(str) {\n\
  //benchmark with using match and uniq array\n\
  var arr = [];\n\
  str.replace(/\\.\\w+|\\w+ *\\(|\"[^\"]*\"|'[^']*'|\\/([^/]+)\\//g, '')\n\
    .replace(/[a-zA-Z_]\\w*/g, function(expr) {\n\
      if(!~indexOf(arr, expr)) arr.push(expr);\n\
    });\n\
  return arr;\n\
}\n\
\n\
\n\
function fn(_) {\n\
  return 'model.' + _;\n\
}\n\
\n\
\n\
function map(str) {\n\
  var arr = props(str);\n\
  return str.replace(re, function(_){\n\
    if ('(' == _[_.length - 1]) return fn(_);\n\
    if (!~indexOf(arr, _)) return _;\n\
    return fn(_);\n\
  });\n\
}\n\
\n\
\n\
/**\n\
 * Scope statement with object.\n\
 * \n\
 * @param  {string} statement\n\
 * @return {Function}         \n\
 */\n\
\n\
function scope(str) {\n\
  return new Function('model', 'return ' + map(str));\n\
}\n\
\n\
\n\
\n\
/**\n\
 * Variable substitution on the string.\n\
 *\n\
 * @param {String} str\n\
 * @param {Object} model\n\
 * @return {String} interpolation's result\n\
 */\n\
\n\
 module.exports = function(text, model){\n\
\t//TODO:  cache the function the entire text or just the expression?\n\
  return text.replace(/\\{\\{([^}]+)\\}\\}/g, function(_, expr) {\n\
  \tif(/[.'[+(]/.test(expr)) {\n\
  \t\tvar fn = cache[expr] = cache[expr] || scope(expr);\n\
  \t\treturn fn(model) || '';\n\
  \t}\n\
    return model[trim(expr)] || '';\n\
  });\n\
};\n\
\n\
\n\
module.exports.attrs = function(text) {\n\
  var exprs = [];\n\
  text.replace(/\\{\\{([^}]+)\\}\\}/g, function(_, expr){\n\
    var val = trim(expr);\n\
    if(!~indexOf(exprs, val)) exprs.push(val);\n\
  });\n\
  return exprs;\n\
};//@ sourceURL=bredele-supplant/index.js"
));
require.register("component-indexof/index.js", Function("exports, require, module",
"module.exports = function(arr, obj){\n\
  if (arr.indexOf) return arr.indexOf(obj);\n\
  for (var i = 0; i < arr.length; ++i) {\n\
    if (arr[i] === obj) return i;\n\
  }\n\
  return -1;\n\
};//@ sourceURL=component-indexof/index.js"
));
require.register("component-trim/index.js", Function("exports, require, module",
"\n\
exports = module.exports = trim;\n\
\n\
function trim(str){\n\
  if (str.trim) return str.trim();\n\
  return str.replace(/^\\s*|\\s*$/g, '');\n\
}\n\
\n\
exports.left = function(str){\n\
  if (str.trimLeft) return str.trimLeft();\n\
  return str.replace(/^\\s*/, '');\n\
};\n\
\n\
exports.right = function(str){\n\
  if (str.trimRight) return str.trimRight();\n\
  return str.replace(/\\s*$/, '');\n\
};\n\
//@ sourceURL=component-trim/index.js"
));
require.register("bredele-binding/index.js", Function("exports, require, module",
"var Store = require('store'),\n\
    trim = require('trim'),\n\
    indexOf = require('indexof'),\n\
    supplant = require('supplant');\n\
\n\
\n\
/**\n\
 * Expose 'Binding'\n\
 */\n\
\n\
module.exports = Binding;\n\
\n\
\n\
/**\n\
 * Binding constructor.\n\
 * \n\
 * @api public\n\
 */\n\
\n\
function Binding(model) {\n\
  if(!(this instanceof Binding)) return new Binding(model);\n\
  this.data(model);\n\
  this.plugins = {};\n\
  this.listeners = [];\n\
}\n\
\n\
//TODO: this is for view, instead doing this.binding.model = new Store();\n\
//should we keep this or not?\n\
\n\
Binding.prototype.data = function(data) {\n\
  this.model = new Store(data);\n\
  return this;\n\
};\n\
\n\
\n\
//todo: make better parser and more efficient\n\
function parser(str) {\n\
  //str = str.replace(/ /g,'');\n\
  var phrases = str ? str.split(';') : ['main'];\n\
  var results = [];\n\
  for(var i = 0, l = phrases.length; i < l; i++) {\n\
    var expr = phrases[i].split(':');\n\
\n\
    var params = [];\n\
    var name = expr[0];\n\
\n\
    if(expr[1]) {\n\
      var args = expr[1].split(',');\n\
      for(var j = 0, h = args.length; j < h; j++) {\n\
        params.push(trim(args[j]));\n\
      }\n\
    } else {\n\
      name = 'main'; //doesn't do anything\n\
    }\n\
\n\
    results.push({\n\
      method: trim(expr[0]),\n\
      params: params\n\
    });\n\
  }\n\
  return results;\n\
}\n\
\n\
\n\
/**\n\
 * Bind object as function.\n\
 * \n\
 * @api private\n\
 */\n\
\n\
function binder(obj) {\n\
  var fn = function(el, expr) {\n\
    var formats = parser(expr);\n\
    for(var i = 0, l = formats.length; i < l; i++) {\n\
      var format = formats[i];\n\
      format.params.splice(0, 0, el);\n\
      obj[format.method].apply(obj, format.params);\n\
    }\n\
  };\n\
  //TODO: find something better\n\
  fn.destroy = function() {\n\
    obj.destroy && obj.destroy();\n\
  };\n\
  return fn;\n\
}\n\
\n\
\n\
/**\n\
 * Add binding by name\n\
 * \n\
 * @param {String} name  \n\
 * @param {Object} plugin \n\
 * @return {Binding}\n\
 * @api public\n\
 */\n\
\n\
Binding.prototype.add = function(name, plugin) {\n\
  if(typeof plugin === 'object') plugin = binder(plugin);\n\
  this.plugins[name] = plugin;\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Substitue node text with data.\n\
 * \n\
 * @param  {HTMLElement} node  type 3\n\
 * @param  {Store} store \n\
 * @api private\n\
 */\n\
\n\
Binding.prototype.text = function(node, store) {\n\
  var text = node.nodeValue;\n\
  //we should do {{ but it doesn't work on ie\n\
  if(!~ indexOf(text, '{')) return;\n\
\n\
  var exprs = supplant.attrs(text),\n\
      handle = function() {\n\
        //should we cache a function?\n\
        node.nodeValue = supplant(text, store.data);\n\
      };\n\
\n\
  handle();\n\
\n\
  for(var l = exprs.length; l--;) {\n\
    this.listeners.push(store.on('change ' + exprs[l], handle));\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Apply binding's on a single node\n\
 * \n\
 * @param  {DomElement} node \n\
 * @api private\n\
 */\n\
\n\
Binding.prototype.bind = function(node) {\n\
  var type = node.nodeType;\n\
  //dom element\n\
  if (type === 1) {\n\
    var attrs = node.attributes;\n\
    for(var i = 0, l = attrs.length; i < l; i++) {\n\
      var attr = attrs[i],\n\
          plugin = this.plugins[attr.nodeName];\n\
\n\
      if(plugin) {\n\
        plugin.call(this.model, node, attr.nodeValue);\n\
      } else {\n\
        this.text(attr, this.model);\n\
      }\n\
    }\n\
    return;\n\
  }\n\
  // text node\n\
  if (type === 3) this.text(node, this.model);\n\
};\n\
\n\
\n\
/**\n\
 * Apply bindings on nested DOM element.\n\
 * \n\
 * @param  {DomElement} node\n\
 * @return {Binding}\n\
 * @api public\n\
 */\n\
\n\
Binding.prototype.scan = function(node, bool) {\n\
  if(bool) return this.query(node);\n\
  var nodes = node.childNodes;\n\
  this.bind(node);\n\
  for (var i = 0, l = nodes.length; i < l; i++) {\n\
    this.scan(nodes[i]);\n\
  }\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Query plugins and execute them.\n\
 * \n\
 * @param  {Element} el \n\
 * @api private\n\
 */\n\
\n\
Binding.prototype.query = function(el) {\n\
  //TODO: refactor\n\
  var parent = el.parentElement;\n\
  if(!parent) {\n\
    parent = document.createDocumentFragment();\n\
    parent.appendChild(el);\n\
  }\n\
  for(var name in this.plugins) {\n\
    var nodes = parent.querySelectorAll('[' + name + ']');\n\
    for(var i = 0, l = nodes.length; i < l; i++) {\n\
      var node = nodes[i];\n\
      this.plugins[name].call(this.model, node, node.getAttribute(name));\n\
    }\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Destroy binding's plugins and unsubscribe\n\
 * to emitter.\n\
 * \n\
 * @api public\n\
 */\n\
\n\
Binding.prototype.remove = function() {\n\
  for(var l = this.listeners.length; l--;) {\n\
    var listener = this.listeners[l];\n\
    this.model.off(listener[0],listener[1]);\n\
  }\n\
\n\
  for(var name in this.plugins) {\n\
    var plugin = this.plugins[name];\n\
    plugin.destroy && plugin.destroy();\n\
  }\n\
};\n\
//@ sourceURL=bredele-binding/index.js"
));
require.register("bredele-brick/index.js", Function("exports, require, module",
"var Store = require('store'),\n\
\t\tbinding = require('binding'),\n\
\t\teach = require('each');\n\
\n\
\n\
/**\n\
 * Expose 'Lego'\n\
 */\n\
\n\
module.exports = Brick;\n\
\n\
\n\
/**\n\
 * Brick constructor.\n\
 * example:\n\
 * \n\
 *   var lego = require('lego');\n\
 *   \n\
 *   lego('<span>lego</span>');\n\
 *   lego('<span>{{ label }}</span>', {\n\
 *     label: 'lego'\n\
 *   });\n\
 *\n\
 * @event 'before ready'\n\
 * @event 'ready' \n\
 * @api public\n\
 */\n\
\n\
function Brick(tmpl, data) {\n\
 if(!(this instanceof Brick)) return new Brick(tmpl, data);\n\
 this.data = data || {};\n\
\n\
 //refactor binding\n\
 this.bindings = binding();\n\
 this.bindings.model = this;\n\
\n\
 this.formatters = {}; //do we need formatters?\n\
 this.el = null;\n\
 this.dom(tmpl);\n\
 this.once('before inserted', function(bool) {\n\
 \tthis.emit('before ready');\n\
 \tthis.bindings.scan(this.el, bool);\n\
 \tthis.emit('ready');\n\
 }, this);\n\
}\n\
\n\
\n\
//mixin\n\
\n\
for (var key in Store.prototype) {\n\
  Brick.prototype[key] = Store.prototype[key];\n\
}\n\
\n\
\n\
/**\n\
 * Add attribure binding.\n\
 * example:\n\
 *\n\
 *   view.add('on', event(obj));\n\
 *   view.add({\n\
 *     'on' : event(obj).\n\
 *     'repeat' : repeat()\n\
 *   });\n\
 *   \n\
 * @param {String|Object} name\n\
 * @param {Function} plug \n\
 * @return {Brick}\n\
 * @api public\n\
 */\n\
\n\
Brick.prototype.add = function(name, plug) {\n\
\tif(typeof name !== 'string') {\n\
\t\teach(name, this.add, this);\n\
\t} else {\n\
\t\tthis.bindings.add(name, plug);\n\
\t\tif(plug.init) plug.init(this);\n\
\t}\n\
\treturn this;\n\
};\n\
\n\
\n\
/**\n\
 * Render template into dom.\n\
 * example:\n\
 *\n\
 *   view.dom('<span>lego</span>');\n\
 *   view.dom(dom);\n\
 *   \n\
 * @param  {String|Element} tmpl\n\
 * @return {Brick}\n\
 * @event 'rendered' \n\
 * @api public\n\
 */\n\
\n\
Brick.prototype.dom = function(tmpl) {\n\
\tif(typeof tmpl === 'string') {\n\
\t\tvar div = document.createElement('div');\n\
\t\tdiv.insertAdjacentHTML('beforeend', tmpl);\n\
\t\tthis.el = div.firstChild;\n\
\t} else {\n\
\t\tthis.el = tmpl;\n\
\t}\n\
\tthis.emit('rendered');\n\
\treturn this;\n\
};\n\
\n\
\n\
/**\n\
 * Substitute variable and apply\n\
 * attribute bindings.\n\
 * example:\n\
 *\n\
 *    view.build();\n\
 *    view.build(el);\n\
 *\n\
 *    //only apply attribute bindings\n\
 *    view.build)(el, true);\n\
 *    \n\
 * @param  {Element} parent\n\
 * @param {Boolean} query\n\
 * @return {Brick}\n\
 * @event 'before inserted'\n\
 * @event 'inserted' \n\
 * @api public\n\
 */\n\
\n\
Brick.prototype.build = function(parent, query) {\n\
\tif(this.el) {\n\
\t\tthis.emit('before inserted', query); //should we pass parent?\n\
\t\tif(parent) {\n\
\t\t\tparent.appendChild(this.el); //use cross browser insertAdjacentElement\n\
\t\t\tthis.emit('inserted');\n\
\t\t}\n\
\t}\n\
\treturn this;\n\
};\n\
\n\
\n\
/**\n\
 * Remove attribute bindings, store\n\
 * listeners and remove dom.\n\
 * \n\
 * @return {Brick}\n\
 * @event 'before removed'\n\
 * @event 'removed' \n\
 * @api public\n\
 */\n\
\n\
Brick.prototype.remove = function() {\n\
\tvar parent = this.el.parentElement;\n\
\tthis.emit('before removed');\n\
\tthis.bindings.remove();\n\
\tif(parent) {\n\
\t\t\t//this.emit('removed');\n\
\t\t\tparent.removeChild(this.el);\n\
\t}\n\
\tthis.emit('removed');\n\
\treturn this;\n\
};\n\
\n\
//partials, directive\n\
//@ sourceURL=bredele-brick/index.js"
));
require.register("bredele-lego/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose 'Mod'\n\
 */\n\
\n\
exports = module.exports = require('brick');\n\
\n\
exports.box = require('artery');//@ sourceURL=bredele-lego/index.js"
));
require.register("bredele-event/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Polyfill\n\
 */\n\
\n\
var attach = window.addEventListener ? 'addEventListener' : 'attachEvent',\n\
\t\tdetach = window.removeEventListener ? 'removeEventListener' : 'detachEvent',\n\
\t\tprefix = attach !== 'addEventListener' ? 'on' : '',\n\
\t\tindexOf = require('indexof');\n\
\n\
/**\n\
 * Matches query selection.\n\
 * \n\
 * @param  {HTMLElement} el \n\
 * @param  {HTMLElement} target  \n\
 * @param  {String} selector \n\
 * @return {Boolean}  true if the element would be selected by the \n\
 * specified selector string\n\
 */\n\
\n\
function matches(el, target, selector) {\n\
\treturn indexOf([].slice.call(el.querySelectorAll(selector)), target) > -1 ;\n\
}\n\
\n\
\n\
module.exports = event;\n\
\n\
\n\
/**\n\
 * Attach Event Listener.\n\
 * \n\
 * @param  {HTMLElement}   el\n\
 * @param  {String}   str\n\
 * @param  {Function} fn \n\
 * @param  {Boolean}   capture\n\
 * @return {Array} handler to detach event      \n\
 */\n\
\n\
function event(el, str, fn, capture) {\n\
\tvar filter = str.split('>'),\n\
\t\t\tphrase = filter[0].split(' '),\n\
\t\t\ttopic = phrase.shift(),\n\
\t\t\tselector = phrase.join(' ');\n\
\n\
\t//TODO: do that globally?\n\
\tvar cb = function(ev) {\n\
\t\tvar target = ev.target || ev.srcElement;\n\
\t\tif(!selector || matches(el, target, selector)) {\n\
\t\t\tvar code = filter[1] && filter[1].replace(/ /g,'');\n\
\t\t\tif(!code || ev.keyCode.toString() === code) fn(target, ev);\n\
\t\t}\n\
\t};\n\
\n\
\tel[attach](prefix + topic, cb, capture || false);\n\
\treturn [topic, cb, capture];\n\
}\n\
\n\
\n\
/**\n\
 * Detach event listener.\n\
 * \n\
 * @param  {HTMLElement}   el\n\
 * @param  {String}   str\n\
 * @param  {Function} fn\n\
 * @param  {Boolean}   capture   \n\
 */\n\
\n\
event.off = function(el, str, fn, capture) {\n\
\tel[detach](prefix + str, fn, capture || false);\n\
};\n\
//@ sourceURL=bredele-event/index.js"
));
require.register("bredele-events-brick/index.js", Function("exports, require, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var ev = require('event');\n\
\n\
/**\n\
 * Map touch events.\n\
 * @type {Object}\n\
 * @api private\n\
 */\n\
\n\
var mapper = {\n\
\t'click' : 'touchend',\n\
\t'mousedown' : 'touchstart',\n\
\t'mouseup' : 'touchend',\n\
\t'mousemove' : 'touchmove'\n\
};\n\
\n\
\n\
/**\n\
 * Expose 'Event plugin'\n\
 */\n\
\n\
module.exports = Events;\n\
\n\
\n\
/**\n\
 * Event plugin constructor\n\
 * @param {Object} view event plugin scope\n\
 * @param {Boolean} isTouch optional\n\
 * @api public\n\
 */\n\
\n\
function Events(view, isTouch){\n\
  if(!(this instanceof Events)) return new Events(view, isTouch);\n\
  this.view = view;\n\
  this.listeners = [];\n\
  this.isTouch = isTouch || (window.ontouchstart !== undefined);\n\
}\n\
\n\
\n\
\n\
/**\n\
 * Listen events.\n\
 * @param {HTMLElement} node \n\
 * @param {String} type event's type\n\
 * @param {String} fn view's callback name\n\
 * @param {String} capture useCapture\n\
 * @api private\n\
 */\n\
\n\
Events.prototype.on = function(node, type, fn, capture) {\n\
  var _this = this,\n\
     cb = function(target, e) {\n\
      _this.view[fn].call(_this.view, target, e, node); //we should pass target\n\
     };\n\
  //todo: event should return the node as well...it's too complicated\n\
  this.listeners\n\
    .push([node].concat(ev(node, type, (typeof fn === 'function') ? fn : cb, (capture === 'true'))));\n\
};\n\
\n\
\n\
\n\
/**\n\
 * Map events (desktop and mobile)\n\
 * @param  {String} type event's name\n\
 * @return {String} mapped event\n\
 */\n\
\n\
Events.prototype.map = function(type) {\n\
\treturn this.isTouch ? (mapper[type] || type) : type;\n\
};\n\
\n\
\n\
/**\n\
 * Remove all listeners.\n\
 * @api public\n\
 */\n\
\n\
Events.prototype.destroy = function() {\n\
  for(var l = this.listeners.length; l--;) {\n\
    var listener = this.listeners[l];\n\
    ev.off(listener[0], listener[1], listener[2], listener[3]);\n\
  }\n\
  this.listeners = [];\n\
};\n\
\n\
//@ sourceURL=bredele-events-brick/index.js"
));
require.register("hello/index.js", Function("exports, require, module",
"//dependencies\n\
\n\
var lego = require('lego');\n\
var html = require('./hello.html');\n\
var events = require('events-brick');\n\
\n\
\n\
//create view\n\
\n\
var view = lego(html, {\n\
\tcolor: 'red',\n\
\tlabel: 'Hello World'\n\
});\n\
\n\
\n\
//add event brick\n\
view.add('ev', events({\n\
\tname: function(target) {\n\
\t\tconsole.log(target.value);\n\
\t\tview.set('label', target.value);\n\
\t}\n\
}));\n\
\n\
//insert view into body\n\
\n\
view.build(document.body);//@ sourceURL=hello/index.js"
));
require.register("computed/index.js", Function("exports, require, module",
"//dependencies\n\
\n\
var lego = require('lego');\n\
var html = require('./computed.html');\n\
var events = require('events-brick');\n\
\n\
\n\
//create view\n\
\n\
var view = lego(html, {\n\
\trepo: 'lego',\n\
\tgithub: 'bredele'\n\
});\n\
\n\
\n\
//create computed property\n\
\n\
view.compute('name', function() {\n\
\treturn this.firstName + ' ' + this.lastName;\n\
});\n\
\n\
//add events brick\n\
\n\
view.add('ev', events({\n\
\tfirstName: function(node) {\n\
\t\tview.set('firstName', node.value);\n\
\t},\n\
\tlastName: function(node) {\n\
\t\tview.set('lastName', node.value);\n\
\t}\n\
}));\n\
\n\
//insert view into body\n\
\n\
view.build(document.body);//@ sourceURL=computed/index.js"
));
require.register("home/index.js", Function("exports, require, module",
"require('hello');\n\
require('computed');//@ sourceURL=home/index.js"
));















require.register("hello/hello.html", Function("exports, require, module",
"module.exports = '<div class=\"lego\">\\n\
\t<style>\\n\
\t  .brick {\\n\
\t  \tbackground: {{ color }};\\n\
\t  \tmin-width:80px;\\n\
\t  \theight:80px;\\n\
\t  }\\n\
\t</style>\\n\
\t<input type=\"text\" ev=\"on:input,name\" value=\"Hello World\">\\n\
\t<div class=\"brick\">{{ label }}</div>\\n\
</div>\\n\
';//@ sourceURL=hello/hello.html"
));
require.register("computed/computed.html", Function("exports, require, module",
"module.exports = '<div class=\"computed\">\\n\
\t<p>\\n\
\t\tThis is an example by <a href=\"http://github.com/{{github}}/{{repo}}\">{{github}}</a>\\n\
\t</p>\\n\
\tPlease enter your <input type=\"text\" value=\"first name\" ev=\"on:input,firstName\"> and your <input type=\"text\" value=\"last name\" ev=\"on:input,lastName\">\\n\
\tWelcome <span>{{name}}</span>\\n\
</div>';//@ sourceURL=computed/computed.html"
));
require.alias("home/index.js", "lego-examples/deps/Home/index.js");
require.alias("home/index.js", "lego-examples/deps/Home/index.js");
require.alias("home/index.js", "Home/index.js");
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
require.alias("bredele-events-brick/index.js", "hello/deps/events-brick/index.js");
require.alias("bredele-events-brick/index.js", "hello/deps/events-brick/index.js");
require.alias("bredele-event/index.js", "bredele-events-brick/deps/event/index.js");
require.alias("bredele-event/index.js", "bredele-events-brick/deps/event/index.js");
require.alias("component-indexof/index.js", "bredele-event/deps/indexof/index.js");

require.alias("bredele-event/index.js", "bredele-event/index.js");
require.alias("bredele-events-brick/index.js", "bredele-events-brick/index.js");
require.alias("hello/index.js", "hello/index.js");
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
require.alias("bredele-events-brick/index.js", "computed/deps/events-brick/index.js");
require.alias("bredele-events-brick/index.js", "computed/deps/events-brick/index.js");
require.alias("bredele-event/index.js", "bredele-events-brick/deps/event/index.js");
require.alias("bredele-event/index.js", "bredele-events-brick/deps/event/index.js");
require.alias("component-indexof/index.js", "bredele-event/deps/indexof/index.js");

require.alias("bredele-event/index.js", "bredele-event/index.js");
require.alias("bredele-events-brick/index.js", "bredele-events-brick/index.js");
require.alias("computed/index.js", "computed/index.js");
require.alias("home/index.js", "home/index.js");