function require(e,r,i){var t=require.resolve(e)
if(null==t){i=i||e,r=r||"root"
var n=Error('Failed to require "'+i+'" from "'+r+'"')
throw n.path=i,n.parent=r,n.require=!0,n}var s=require.modules[t]
if(!s._resolving&&!s.exports){var o={}
o.exports={},o.client=o.component=!0,s._resolving=!0,s.call(this,o.exports,require.relative(t),o),delete s._resolving,s.exports=o.exports}return s.exports}require.modules={},require.aliases={},require.resolve=function(e){"/"===e.charAt(0)&&(e=e.slice(1))
for(var r=[e,e+".js",e+".json",e+"/index.js",e+"/index.json"],i=0;i<r.length;i++){var e=r[i]
if(require.modules.hasOwnProperty(e))return e
if(require.aliases.hasOwnProperty(e))return require.aliases[e]}},require.normalize=function(e,r){var i=[]
if("."!=r.charAt(0))return r
e=e.split("/"),r=r.split("/")
for(var t=0;t<r.length;++t)".."==r[t]?e.pop():"."!=r[t]&&""!=r[t]&&i.push(r[t])
return e.concat(i).join("/")},require.register=function(e,r){require.modules[e]=r},require.alias=function(e,r){if(!require.modules.hasOwnProperty(e))throw Error('Failed to alias "'+e+'", it does not exist')
require.aliases[r]=e},require.relative=function(e){function r(e,r){for(var i=e.length;i--;)if(e[i]===r)return i
return-1}function i(r){var t=i.resolve(r)
return require(t,e,r)}var t=require.normalize(e,"..")
return i.resolve=function(i){var n=i.charAt(0)
if("/"==n)return i.slice(1)
if("."==n)return require.normalize(t,i)
var s=e.split("/"),o=r(s,"deps")+1
return o||(o=0),i=s.slice(0,o+1).join("/")+"/deps/"+i},i.exists=function(e){return require.modules.hasOwnProperty(i.resolve(e))},i},require.register("bredele-each/index.js",function(e,r,i){function t(e,r,i){for(var t in e)e.hasOwnProperty(t)&&r.call(i,t,e[t])}function n(e,r,i){for(var t=0,n=e.length;n>t;t++)r.call(i,t,e[t])}i.exports=function(e,r,i){e instanceof Array?n(e,r,i):"object"==typeof e&&t(e,r,i)}}),require.register("bredele-clone/index.js",function(e,r,i){function t(e){if("object"==typeof e){var r={}
for(var i in e)e.hasOwnProperty(i)&&(r[i]=t(e[i]))
return r}return e}i.exports=function(e){var r=null
return r=e instanceof Array?e.slice(0):t(e)}}),require.register("bredele-store/index.js",function(e,r,i){function t(e){return e instanceof t?e:(this.data=e||{},this.formatters={},void 0)}var n=r("emitter"),s=r("clone"),o=r("each"),a=window.localStorage
i.exports=t,n(t.prototype),t.prototype.set=function(e,r){var i=this.data[e]
return"object"==typeof e?o(e,this.set,this):(i!==r&&(this.data[e]=r,this.emit("change",e,r,i),this.emit("change "+e,r,i)),void 0)},t.prototype.get=function(e){var r=this.formatters[e],i=this.data[e]
return r&&(i=r[0].call(r[1],i)),i},t.prototype.has=function(e){return this.data.hasOwnProperty(e)},t.prototype.del=function(e){this.has(e)&&(this.data instanceof Array?this.data.splice(e,1):delete this.data[e],this.emit("deleted",e,e),this.emit("deleted "+e,e))},t.prototype.format=function(e,r,i){return this.formatters[e]=[r,i],this},t.prototype.compute=function(e,r){var i=""+r,t=i.match(/this.[a-zA-Z0-9]*/g)
this.set(e,r.call(this.data))
for(var n=t.length;n--;)this.on("change "+t[n].slice(5),function(){this.set(e,r.call(this.data))})},t.prototype.reset=function(e){var r=s(this.data),i=e.length
this.data=e,o(r,function(r){void 0===e[r]&&(this.emit("deleted",r,i),this.emit("deleted "+r,i))},this),o(e,function(e,i){var t=r[e]
t!==i&&(this.emit("change",e,i,t),this.emit("change "+e,i,t))},this)},t.prototype.loop=function(e,r){o(this.data,e,r||this)},t.prototype.local=function(e,r){r?this.reset(JSON.parse(a.getItem(e))):a.setItem(e,this.toJSON())},t.prototype.use=function(e){return e(this),this},t.prototype.toJSON=function(){return JSON.stringify(this.data)}}),require.register("component-emitter/index.js",function(e,r,i){function t(e){return e?n(e):void 0}function n(e){for(var r in t.prototype)e[r]=t.prototype[r]
return e}i.exports=t,t.prototype.on=t.prototype.addEventListener=function(e,r){return this._callbacks=this._callbacks||{},(this._callbacks[e]=this._callbacks[e]||[]).push(r),this},t.prototype.once=function(e,r){function i(){t.off(e,i),r.apply(this,arguments)}var t=this
return this._callbacks=this._callbacks||{},i.fn=r,this.on(e,i),this},t.prototype.off=t.prototype.removeListener=t.prototype.removeAllListeners=t.prototype.removeEventListener=function(e,r){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this
var i=this._callbacks[e]
if(!i)return this
if(1==arguments.length)return delete this._callbacks[e],this
for(var t,n=0;n<i.length;n++)if(t=i[n],t===r||t.fn===r){i.splice(n,1)
break}return this},t.prototype.emit=function(e){this._callbacks=this._callbacks||{}
var r=[].slice.call(arguments,1),i=this._callbacks[e]
if(i){i=i.slice(0)
for(var t=0,n=i.length;n>t;++t)i[t].apply(this,r)}return this},t.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks[e]||[]},t.prototype.hasListeners=function(e){return!!this.listeners(e).length}}),require.register("bredele-artery/index.js",function(e,r,i){function t(){for(var e=new n,r=0,i=o.length;i>r;r++)s(e,o[r])
return e}var n=r("./lib/app"),s=function(e,r){for(var i in r)r.hasOwnProperty(i)&&(e[i]=r[i])
return e},o=[]
i.exports=t,t.merge=function(){return o=[].slice.call(arguments),this}}),require.register("bredele-artery/lib/app.js",function(e,r,i){function t(e){this.name=e||"",this.sandbox=new n}var n=r("store"),s=r("emitter"),o=new s
i.exports=t,t.prototype.on=function(){return o.on.apply(o,arguments)},t.prototype.emit=function(e){var r=[this.name+"/"+e].concat([].slice.call(arguments,1))
return o.emit.apply(o,r)},t.prototype.once=function(){return o.once.apply(o,arguments)},t.prototype.off=function(){return o.off.apply(o,arguments)},t.prototype.init=function(e){return e?this.sandbox.on("init",e):(this.sandbox.emit("init"),void 0)},t.prototype.use=function(e,r){"function"==typeof e&&e.call(null,this),r&&r.use&&(r.name=e,r.sandbox.emit("init"),this.sandbox.emit("init "+r.name))},t.prototype.config=function(e,r){return e?"object"==typeof e?(this.sandbox.reset(e),void 0):r?(this.sandbox.set(e,r),void 0):this.sandbox.get(e):this.sandbox.data},t.prototype.debug=function(){}}),require.register("bredele-supplant/index.js",function(e,r,i){function t(e){var r=[]
return e.replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g,"").replace(/[a-zA-Z_]\w*/g,function(e){~l(r,e)||r.push(e)}),r}function n(e){return"model."+e}function s(e){var r=t(e)
return e.replace(u,function(e){return"("==e[e.length-1]?n(e):~l(r,e)?n(e):e})}function o(e){return Function("model","return "+s(e))}function a(){this.match=/\{\{([^}]+)\}([^}]*)\}/g,this.filters={}}var l=r("indexof"),d=r("trim"),u=/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g,c={}
i.exports=a,a.prototype.text=function(e,r){var i=this
return e.replace(this.match,function(e,t,n){var s
if(/[\.\'\[\+\(\|]/.test(t)){var a=c[t]=c[t]||o(t)
s=a(r)||""}else s=r[d(t)]||""
if(n)for(var l=n.split("|"),u=1,p=l.length;p>u;u++){var h=i.filters[d(l[u])]
h&&(s=h(s))}return s})},a.prototype.props=function(e){var r=[]
return e.replace(this.match,function(e,i){var n=d(i)
~l(r,n)||(r=r.concat(t(n)))}),r},a.prototype.filter=function(e,r){return this.filters[e]=r,this}}),require.register("component-indexof/index.js",function(e,r,i){i.exports=function(e,r){if(e.indexOf)return e.indexOf(r)
for(var i=0;i<e.length;++i)if(e[i]===r)return i
return-1}}),require.register("component-trim/index.js",function(e,r,i){function t(e){return e.trim?e.trim():e.replace(/^\s*|\s*$/g,"")}e=i.exports=t,e.left=function(e){return e.trimLeft?e.trimLeft():e.replace(/^\s*/,"")},e.right=function(e){return e.trimRight?e.trimRight():e.replace(/\s*$/,"")}}),require.register("bredele-binding/index.js",function(e,r,i){function t(e){return this instanceof t?(this.data(e),this.plugins={},this.subs=new d,this.listeners=[],this.filters={},void 0):new t(e)}function n(e){for(var r=e?e.split(";"):["main"],i=[],t=0,n=r.length;n>t;t++){var s=r[t].split(":"),o=[],l=s[0]
if(s[1])for(var d=s[1].split(","),u=0,c=d.length;c>u;u++)o.push(a(d[u]))
else l="main"
i.push({method:a(s[0]),params:o})}return i}function s(e){var r=function(r,i){for(var t=n(i),s=0,o=t.length;o>s;s++){var a=t[s]
a.params.splice(0,0,r),e[a.method].apply(e,a.params)}}
return r.destroy=function(){e.destroy&&e.destroy()},r}var o=r("store"),a=r("trim"),l=r("indexof"),d=r("supplant")
i.exports=t,t.prototype.data=function(e){return this.model=new o(e),this},t.prototype.add=function(e,r){return"object"==typeof r&&(r=s(r)),this.plugins[e]=r,this},t.prototype.filter=function(e,r){return this.filters[e]=r,this},t.prototype.text=function(e,r){var i=e.nodeValue,t=this
if(~l(i,"{")){var n=this.subs.props(i),s=function(){e.nodeValue=t.subs.text(i,r.data)}
s()
for(var o=n.length;o--;)this.listeners.push(r.on("change "+n[o],s))}},t.prototype.bind=function(e){var r=e.nodeType
if(1!==r)3===r&&this.text(e,this.model)
else for(var i=e.attributes,t=0,n=i.length;n>t;t++){var s=i[t],o=this.plugins[s.nodeName]
o?o.call(this.model,e,s.nodeValue):this.text(s,this.model)}},t.prototype.scan=function(e,r){if(r)return this.query(e)
var i=e.childNodes
this.bind(e)
for(var t=0,n=i.length;n>t;t++)this.scan(i[t])
return this},t.prototype.query=function(e){var r=e.parentElement
r||(r=document.createDocumentFragment(),r.appendChild(e))
for(var i in this.plugins)for(var t=r.querySelectorAll("["+i+"]"),n=0,s=t.length;s>n;n++){var o=t[n]
this.plugins[i].call(this.model,o,o.getAttribute(i))}},t.prototype.remove=function(){for(var e=this.listeners.length;e--;){var r=this.listeners[e]
this.model.off(r[0],r[1])}for(var i in this.plugins){var t=this.plugins[i]
t.destroy&&t.destroy()}}}),require.register("bredele-brick-view/index.js",function(e,r,i){function t(e,r){return this instanceof t?(this.data=r||{},this.bindings=s(),this.bindings.model=this,this.formatters={},this.el=null,this.dom(e),this.once("before inserted",function(e){this.emit("before ready"),this.bindings.scan(this.el,e),this.emit("ready")},this),void 0):new t(e,r)}var n=r("store"),s=r("binding"),o=r("each")
i.exports=t
for(var a in n.prototype)t.prototype[a]=n.prototype[a]
t.prototype.add=function(e,r){return"string"!=typeof e?o(e,this.add,this):(this.bindings.add(e,r),r.init&&r.init(this)),this},t.prototype.filter=function(e,r){return this.bindings.subs.filter(e,r),this},t.prototype.dom=function(e){if("string"==typeof e){var r=document.createElement("div")
r.insertAdjacentHTML("beforeend",e),this.el=r.firstChild}else this.el=e
return this.emit("rendered"),this},t.prototype.build=function(e,r){return this.el&&(this.emit("before inserted",r),e&&(e.appendChild(this.el),this.emit("inserted"))),this},t.prototype.remove=function(){var e=this.el.parentElement
return this.emit("before removed"),this.bindings.remove(),e&&e.removeChild(this.el),this.emit("removed"),this}}),require.register("brick/index.js",function(e,r,i){e=i.exports=r("brick-view"),e.box=r("artery")}),require.alias("bredele-artery/index.js","brick/deps/artery/index.js"),require.alias("bredele-artery/lib/app.js","brick/deps/artery/lib/app.js"),require.alias("bredele-artery/index.js","brick/deps/artery/index.js"),require.alias("bredele-artery/index.js","artery/index.js"),require.alias("bredele-store/index.js","bredele-artery/deps/store/index.js"),require.alias("bredele-store/index.js","bredele-artery/deps/store/index.js"),require.alias("component-emitter/index.js","bredele-store/deps/emitter/index.js"),require.alias("bredele-each/index.js","bredele-store/deps/each/index.js"),require.alias("bredele-each/index.js","bredele-store/deps/each/index.js"),require.alias("bredele-each/index.js","bredele-each/index.js"),require.alias("bredele-clone/index.js","bredele-store/deps/clone/index.js"),require.alias("bredele-clone/index.js","bredele-store/deps/clone/index.js"),require.alias("bredele-clone/index.js","bredele-clone/index.js"),require.alias("bredele-store/index.js","bredele-store/index.js"),require.alias("component-emitter/index.js","bredele-artery/deps/emitter/index.js"),require.alias("bredele-artery/index.js","bredele-artery/index.js"),require.alias("bredele-brick-view/index.js","brick/deps/brick-view/index.js"),require.alias("bredele-brick-view/index.js","brick/deps/brick-view/index.js"),require.alias("bredele-brick-view/index.js","brick-view/index.js"),require.alias("bredele-binding/index.js","bredele-brick-view/deps/binding/index.js"),require.alias("bredele-binding/index.js","bredele-brick-view/deps/binding/index.js"),require.alias("bredele-supplant/index.js","bredele-binding/deps/supplant/index.js"),require.alias("bredele-supplant/index.js","bredele-binding/deps/supplant/index.js"),require.alias("component-indexof/index.js","bredele-supplant/deps/indexof/index.js"),require.alias("component-trim/index.js","bredele-supplant/deps/trim/index.js"),require.alias("bredele-supplant/index.js","bredele-supplant/index.js"),require.alias("bredele-store/index.js","bredele-binding/deps/store/index.js"),require.alias("bredele-store/index.js","bredele-binding/deps/store/index.js"),require.alias("component-emitter/index.js","bredele-store/deps/emitter/index.js"),require.alias("bredele-each/index.js","bredele-store/deps/each/index.js"),require.alias("bredele-each/index.js","bredele-store/deps/each/index.js"),require.alias("bredele-each/index.js","bredele-each/index.js"),require.alias("bredele-clone/index.js","bredele-store/deps/clone/index.js"),require.alias("bredele-clone/index.js","bredele-store/deps/clone/index.js"),require.alias("bredele-clone/index.js","bredele-clone/index.js"),require.alias("bredele-store/index.js","bredele-store/index.js"),require.alias("component-indexof/index.js","bredele-binding/deps/indexof/index.js"),require.alias("component-trim/index.js","bredele-binding/deps/trim/index.js"),require.alias("bredele-binding/index.js","bredele-binding/index.js"),require.alias("bredele-store/index.js","bredele-brick-view/deps/store/index.js"),require.alias("bredele-store/index.js","bredele-brick-view/deps/store/index.js"),require.alias("component-emitter/index.js","bredele-store/deps/emitter/index.js"),require.alias("bredele-each/index.js","bredele-store/deps/each/index.js"),require.alias("bredele-each/index.js","bredele-store/deps/each/index.js"),require.alias("bredele-each/index.js","bredele-each/index.js"),require.alias("bredele-clone/index.js","bredele-store/deps/clone/index.js"),require.alias("bredele-clone/index.js","bredele-store/deps/clone/index.js"),require.alias("bredele-clone/index.js","bredele-clone/index.js"),require.alias("bredele-store/index.js","bredele-store/index.js"),require.alias("bredele-each/index.js","bredele-brick-view/deps/each/index.js"),require.alias("bredele-each/index.js","bredele-brick-view/deps/each/index.js"),require.alias("bredele-each/index.js","bredele-each/index.js"),require.alias("bredele-brick-view/index.js","bredele-brick-view/index.js"),require.alias("brick/index.js","brick/index.js")