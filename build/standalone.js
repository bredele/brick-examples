require.register("bredele-each/index.js",function(e,t,i){function r(e,t,i){for(var r in e)e.hasOwnProperty(r)&&t.call(i,r,e[r])}function n(e,t,i){for(var r=0,n=e.length;n>r;r++)t.call(i,r,e[r])}i.exports=function(e,t,i){e instanceof Array?n(e,t,i):"object"==typeof e&&r(e,t,i)}}),require.register("bredele-clone/index.js",function(e,t,i){function r(e){if("object"==typeof e){var t={}
for(var i in e)e.hasOwnProperty(i)&&(t[i]=r(e[i]))
return t}return e}i.exports=function(e){var t=null
return t=e instanceof Array?e.slice(0):r(e)}}),require.register("bredele-store/index.js",function(e,t,i){function r(e){return e instanceof r?e:(this.data=e||{},this.formatters={},void 0)}var n=t("emitter"),s=t("clone"),o=t("each"),l=window.localStorage
i.exports=r,n(r.prototype),r.prototype.set=function(e,t){var i=this.data[e]
return"object"==typeof e?o(e,this.set,this):(i!==t&&(this.data[e]=t,this.emit("change",e,t,i),this.emit("change "+e,t,i)),void 0)},r.prototype.get=function(e){var t=this.formatters[e],i=this.data[e]
return t&&(i=t[0].call(t[1],i)),i},r.prototype.has=function(e){return this.data.hasOwnProperty(e)},r.prototype.del=function(e){this.has(e)&&(this.data instanceof Array?this.data.splice(e,1):delete this.data[e],this.emit("deleted",e,e),this.emit("deleted "+e,e))},r.prototype.format=function(e,t,i){return this.formatters[e]=[t,i],this},r.prototype.compute=function(e,t){var i=""+t,r=i.match(/this.[a-zA-Z0-9]*/g)
this.set(e,t.call(this.data))
for(var n=r.length;n--;)this.on("change "+r[n].slice(5),function(){this.set(e,t.call(this.data))})},r.prototype.reset=function(e){var t=s(this.data),i=e.length
this.data=e,o(t,function(t){void 0===e[t]&&(this.emit("deleted",t,i),this.emit("deleted "+t,i))},this),o(e,function(e,i){var r=t[e]
r!==i&&(this.emit("change",e,i,r),this.emit("change "+e,i,r))},this)},r.prototype.loop=function(e,t){o(this.data,e,t||this)},r.prototype.local=function(e,t){t?this.reset(JSON.parse(l.getItem(e))):l.setItem(e,this.toJSON())},r.prototype.use=function(e){return e(this),this},r.prototype.toJSON=function(){return JSON.stringify(this.data)}}),require.register("component-emitter/index.js",function(e,t,i){function r(e){return e?n(e):void 0}function n(e){for(var t in r.prototype)e[t]=r.prototype[t]
return e}i.exports=r,r.prototype.on=r.prototype.addEventListener=function(e,t){return this._callbacks=this._callbacks||{},(this._callbacks[e]=this._callbacks[e]||[]).push(t),this},r.prototype.once=function(e,t){function i(){r.off(e,i),t.apply(this,arguments)}var r=this
return this._callbacks=this._callbacks||{},i.fn=t,this.on(e,i),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(e,t){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this
var i=this._callbacks[e]
if(!i)return this
if(1==arguments.length)return delete this._callbacks[e],this
for(var r,n=0;n<i.length;n++)if(r=i[n],r===t||r.fn===t){i.splice(n,1)
break}return this},r.prototype.emit=function(e){this._callbacks=this._callbacks||{}
var t=[].slice.call(arguments,1),i=this._callbacks[e]
if(i){i=i.slice(0)
for(var r=0,n=i.length;n>r;++r)i[r].apply(this,t)}return this},r.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks[e]||[]},r.prototype.hasListeners=function(e){return!!this.listeners(e).length}}),require.register("bredele-artery/index.js",function(e,t,i){function r(){for(var e=new n,t=0,i=o.length;i>t;t++)s(e,o[t])
return e}var n=t("./lib/app"),s=function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])
return e},o=[]
i.exports=r,r.merge=function(){return o=[].slice.call(arguments),this}}),require.register("bredele-artery/lib/app.js",function(e,t,i){function r(e){this.name=e||"",this.sandbox=new n}var n=t("store"),s=t("emitter"),o=new s
i.exports=r,r.prototype.on=function(){return o.on.apply(o,arguments)},r.prototype.emit=function(e){var t=[this.name+"/"+e].concat([].slice.call(arguments,1))
return o.emit.apply(o,t)},r.prototype.once=function(){return o.once.apply(o,arguments)},r.prototype.off=function(){return o.off.apply(o,arguments)},r.prototype.init=function(e){return e?this.sandbox.on("init",e):(this.sandbox.emit("init"),void 0)},r.prototype.use=function(e,t){"function"==typeof e&&e.call(null,this),t&&t.use&&(t.name=e,t.sandbox.emit("init"),this.sandbox.emit("init "+t.name))},r.prototype.config=function(e,t){return e?"object"==typeof e?(this.sandbox.reset(e),void 0):t?(this.sandbox.set(e,t),void 0):this.sandbox.get(e):this.sandbox.data},r.prototype.debug=function(){}}),require.register("bredele-supplant/index.js",function(e,t,i){function r(e){var t=[]
return e.replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g,"").replace(/[a-zA-Z_]\w*/g,function(e){~a(t,e)||t.push(e)}),t}function n(e){return"model."+e}function s(e){var t=r(e)
return e.replace(u,function(e){return"("==e[e.length-1]?n(e):~a(t,e)?n(e):e})}function o(e){return Function("model","return "+s(e))}function l(){this.match=/\{\{([^}]+)\}([^}]*)\}/g,this.filters={}}var a=t("indexof"),c=t("trim"),u=/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g,h={}
i.exports=l,l.prototype.text=function(e,t){var i=this
return e.replace(this.match,function(e,r,n){var s
if(/[\.\'\[\+\(\|]/.test(r)){var l=h[r]=h[r]||o(r)
s=l(t)||""}else s=t[c(r)]||""
if(n)for(var a=n.split("|"),u=1,p=a.length;p>u;u++){var d=i.filters[c(a[u])]
d&&(s=d(s))}return s})},l.prototype.props=function(e){var t=[]
return e.replace(this.match,function(e,i){var n=c(i)
~a(t,n)||(t=t.concat(r(n)))}),t},l.prototype.filter=function(e,t){return this.filters[e]=t,this}}),require.register("component-indexof/index.js",function(e,t,i){i.exports=function(e,t){if(e.indexOf)return e.indexOf(t)
for(var i=0;i<e.length;++i)if(e[i]===t)return i
return-1}}),require.register("component-trim/index.js",function(e,t,i){function r(e){return e.trim?e.trim():e.replace(/^\s*|\s*$/g,"")}e=i.exports=r,e.left=function(e){return e.trimLeft?e.trimLeft():e.replace(/^\s*/,"")},e.right=function(e){return e.trimRight?e.trimRight():e.replace(/\s*$/,"")}}),require.register("bredele-binding/index.js",function(e,t,i){function r(e){return this instanceof r?(this.data(e),this.plugins={},this.subs=new c,this.listeners=[],this.filters={},void 0):new r(e)}function n(e){for(var t=e?e.split(";"):["main"],i=[],r=0,n=t.length;n>r;r++){var s=t[r].split(":"),o=[],a=s[0]
if(s[1])for(var c=s[1].split(","),u=0,h=c.length;h>u;u++)o.push(l(c[u]))
else a="main"
i.push({method:l(s[0]),params:o})}return i}function s(e){var t=function(t,i){for(var r=n(i),s=0,o=r.length;o>s;s++){var l=r[s]
l.params.splice(0,0,t),e[l.method].apply(e,l.params)}}
return t.destroy=function(){e.destroy&&e.destroy()},t}var o=t("store"),l=t("trim"),a=t("indexof"),c=t("supplant")
i.exports=r,r.prototype.data=function(e){return this.model=new o(e),this},r.prototype.add=function(e,t){return"object"==typeof t&&(t=s(t)),this.plugins[e]=t,this},r.prototype.filter=function(e,t){return this.filters[e]=t,this},r.prototype.text=function(e,t){var i=e.nodeValue,r=this
if(~a(i,"{")){var n=this.subs.props(i),s=function(){e.nodeValue=r.subs.text(i,t.data)}
s()
for(var o=n.length;o--;)this.listeners.push(t.on("change "+n[o],s))}},r.prototype.bind=function(e){var t=e.nodeType
if(1!==t)3===t&&this.text(e,this.model)
else for(var i=e.attributes,r=0,n=i.length;n>r;r++){var s=i[r],o=this.plugins[s.nodeName]
o?o.call(this.model,e,s.nodeValue):this.text(s,this.model)}},r.prototype.scan=function(e,t){if(t)return this.query(e)
var i=e.childNodes
this.bind(e)
for(var r=0,n=i.length;n>r;r++)this.scan(i[r])
return this},r.prototype.query=function(e){var t=e.parentElement
t||(t=document.createDocumentFragment(),t.appendChild(e))
for(var i in this.plugins)for(var r=t.querySelectorAll("["+i+"]"),n=0,s=r.length;s>n;n++){var o=r[n]
this.plugins[i].call(this.model,o,o.getAttribute(i))}},r.prototype.remove=function(){for(var e=this.listeners.length;e--;){var t=this.listeners[e]
this.model.off(t[0],t[1])}for(var i in this.plugins){var r=this.plugins[i]
r.destroy&&r.destroy()}}}),require.register("bredele-brick-view/index.js",function(e,t,i){function r(e,t){return this instanceof r?(this.data=t||{},this.bindings=s(),this.bindings.model=this,this.formatters={},this.el=null,this.dom(e),this.once("before inserted",function(e){this.emit("before ready"),this.bindings.scan(this.el,e),this.emit("ready")},this),void 0):new r(e,t)}var n=t("store"),s=t("binding"),o=t("each")
i.exports=r
for(var l in n.prototype)r.prototype[l]=n.prototype[l]
r.prototype.add=function(e,t){return"string"!=typeof e?o(e,this.add,this):(this.bindings.add(e,t),t.init&&t.init(this)),this},r.prototype.filter=function(e,t){return this.bindings.subs.filter(e,t),this},r.prototype.dom=function(e){if("string"==typeof e){var t=document.createElement("div")
t.insertAdjacentHTML("beforeend",e),this.el=t.firstChild}else this.el=e
return this.emit("rendered"),this},r.prototype.build=function(e,t){return this.el&&(this.emit("before inserted",t),e&&(e.appendChild(this.el),this.emit("inserted"))),this},r.prototype.remove=function(){var e=this.el.parentElement
return this.emit("before removed"),this.bindings.remove(),e&&e.removeChild(this.el),this.emit("removed"),this}}),require.register("bredele-brick/index.js",function(e,t,i){e=i.exports=t("brick-view"),e.box=t("artery")}),require.register("bredele-repeat-brick/index.js",function(e,t,i){function r(e){return this instanceof r?(this.store=e,this.items=[],void 0):new r(e)}function n(e,t){this.dom=e.cloneNode(!0),this.store=new o(t),this.binding=s(this.store),this.binding.scan(this.dom)}var s=t("binding"),o=t("store"),l=t("each"),a=t("indexof")
i.exports=r,r.prototype.main=r.prototype.list=function(e){var t=e.children[0],i=this
this.node=e,this.clone=t.cloneNode(!0),e.removeChild(t),this.store.on("change",function(e,t){var r=i.items[e]
r?r.reset(t):i.addItem(e,t)}),this.store.on("deleted",function(e,t){i.delItem(t)}),this.store.loop(this.addItem,this)},r.prototype.indexOf=function(e){return a(this.node.children,e)},r.prototype.loop=function(e,t){l(this.items,function(i,r){e.call(t,r.store)})},r.prototype.add=function(e){this.store.set(this.store.data.length,e)},r.prototype.set=function(e,t){e instanceof Element&&(e=this.indexOf(e))
var i=this.items[e].store
l(t,function(e,t){i.set(e,t)})},r.prototype.del=function(e,t){if(void 0===e)return this.store.reset([])
if("function"==typeof e)for(var i=this.store.data.length;i--;)e.call(t,this.items[i].store)&&this.store.del(i)
this.store.del("number"==typeof e?e:this.indexOf(e))},r.prototype.addItem=function(e,t){var i=new n(this.clone,t)
this.items[e]=i,this.node.appendChild(i.dom)},r.prototype.delItem=function(e){var t=this.items[e]
t.unbind(this.node),this.items.splice(e,1),t=null},n.prototype.unbind=function(e){this.store.off(),e.removeChild(this.dom)},n.prototype.reset=function(e){this.store.reset(e)}}),require.register("bredele-domstack/index.js",function(e,t,i){function r(e){this.parent=e,this.fragment=document.createDocumentFragment(),this.directory=[],this.current=null}var n=t("indexof")
i.exports=r,r.prototype.add=function(e,t,i){return i?(this.current&&this.add(this.current[0],this.current[1]),this.current=[e,t],this):(this.directory.push(e),this.fragment.appendChild(t),this)},r.prototype.show=function(e){var t=n(this.directory,e)
if(t>-1){var i=this.fragment.childNodes[t]
this.parent.appendChild(i),this.directory.splice(t,1),this.add(e,i,!0)}return this}}),require.register("component-classes/index.js",function(e,t,i){function r(e){if(!e)throw Error("A DOM element reference is required")
this.el=e,this.list=e.classList}var n=t("indexof"),s=/\s+/,o=Object.prototype.toString
i.exports=function(e){return new r(e)},r.prototype.add=function(e){if(this.list)return this.list.add(e),this
var t=this.array(),i=n(t,e)
return~i||t.push(e),this.el.className=t.join(" "),this},r.prototype.remove=function(e){if("[object RegExp]"==o.call(e))return this.removeMatching(e)
if(this.list)return this.list.remove(e),this
var t=this.array(),i=n(t,e)
return~i&&t.splice(i,1),this.el.className=t.join(" "),this},r.prototype.removeMatching=function(e){for(var t=this.array(),i=0;i<t.length;i++)e.test(t[i])&&this.remove(t[i])
return this},r.prototype.toggle=function(e,t){return this.list?(void 0!==t?t!==this.list.toggle(e,t)&&this.list.toggle(e):this.list.toggle(e),this):(void 0!==t?t?this.add(e):this.remove(e):this.has(e)?this.remove(e):this.add(e),this)},r.prototype.array=function(){var e=this.el.className.replace(/^\s+|\s+$/g,""),t=e.split(s)
return""===t[0]&&t.shift(),t},r.prototype.has=r.prototype.contains=function(e){return this.list?this.list.contains(e):!!~n(this.array(),e)}}),require.register("bredele-control-brick/index.js",function(e,t,i){function r(e,t){return this instanceof r?(this.events=s(null,t),this.scope=e,this.current=null,void 0):new r(e,t)}function n(e){var t=e.replace(/\s+/g," ").split(" ")
return t.length>1?t:["active",t[0]]}var s=t("events-brick"),o=t("classes")
i.exports=r,r.prototype.toggle=function(e,t,i,r){var s=this,l=n(i)
this.events.on(e,t,function(e){o(e).toggle(l[0]),s.scope[l[1]].apply(s.scope,arguments)},r)},r.prototype.radio=function(e,t,i,r){var s=this,l=n(i)
this.events.on(e,t,function(e){s.current&&s.current!==e&&o(s.current).remove(l[0]),o(e).add(l[0]),s.current=e,s.scope[l[1]].apply(s.scope,arguments)},r)},r.prototype.destroy=function(){this.events.destroy()}}),require.register("bredele-search/index.js",function(e,t,i){function r(e){this.namespace=e||"search",this.style=document.createElement("style"),document.head.appendChild(this.style)}i.exports=r,r.prototype.run=function(e,t){var i=t||"searchable",r=""
e&&(r="."+i+":not([data-search*='"+e+"']) { display: none; }"),this.style.innerHTML=r}}),require.register("bredele-event/index.js",function(e,t,i){function r(e,t,i){return a([].slice.call(e.querySelectorAll(i)),t)>-1}function n(e,t,i,n){var o=t.split(">"),a=o[0].split(" "),c=a.shift(),u=a.join(" "),h=function(t){var n=t.target||t.srcElement
if(!u||r(e,n,u)){var s=o[1]&&o[1].replace(/ /g,"")
s&&""+t.keyCode!==s||i(n,t)}}
return e[s](l+c,h,n||!1),[c,h,n]}var s=window.addEventListener?"addEventListener":"attachEvent",o=window.removeEventListener?"removeEventListener":"detachEvent",l="addEventListener"!==s?"on":"",a=t("indexof")
i.exports=n,n.off=function(e,t,i,r){e[o](l+t,i,r||!1)}}),require.register("bredele-events-brick/index.js",function(e,t,i){function r(e,t){return this instanceof r?(this.view=e,this.listeners=[],this.isTouch=t||void 0!==window.ontouchstart,void 0):new r(e,t)}var n=t("event"),s={click:"touchend",mousedown:"touchstart",mouseup:"touchend",mousemove:"touchmove"}
i.exports=r,r.prototype.on=function(e,t,i,r){var s=this,o=function(t,r){s.view[i].call(s.view,t,r,e)}
this.listeners.push([e].concat(n(e,t,"function"==typeof i?i:o,"true"===r)))},r.prototype.map=function(e){return this.isTouch?s[e]||e:e},r.prototype.destroy=function(){for(var e=this.listeners.length;e--;){var t=this.listeners[e]
n.off(t[0],t[1],t[2],t[3])}this.listeners=[]}}),require.register("bredele-input-brick/index.js",function(e,t,i){function r(e,t){var i=this
n(e,"input",function(e){i.set(t,e.value)})}var n=t("event")
i.exports=r}),require.register("hello/index.js",function(e,t,i){var r=t("brick"),n=t("./hello.html"),s=r.box(),o=r(n,{color:"red",label:"Hello!"})
o.add("model",t("input-brick")),o.build(),i.exports=s,i.exports.el=o.el,i.exports.description=t("./description.html"),s.on("console/hello",function(e){o.set(e[0],e[1])})}),require.register("stress/index.js",function(e,t,i){for(var r=t("brick"),n=t("./stress.html"),s=r.box(),o=r(n,{color:"red"}),l=o.el.querySelector(".brick"),a=1e3;a--;)l.insertAdjacentHTML("beforeend","<span>{{ label }}</span>")
o.add("model",t("input-brick")),o.build(),i.exports=s,i.exports.el=o.el,i.exports.description=t("./description.html")}),require.register("computed/index.js",function(e,t,i){var r=t("brick"),n=t("./computed.html"),s=r.box(),o=r(n,{repo:"brick",github:"bredele",firstName:"foo",lastName:"bar"})
o.compute("name",function(){return this.firstName+" "+this.lastName}),o.add("model",t("input-brick")),o.build(),i.exports=s,i.exports.el=o.el,i.exports.description=t("./description.html")}),require.register("expressions/index.js",function(e,t,i){var r=t("brick"),n=t("./expressions.html"),s=r.box(),o=r(n,{label:"Antidisestablishmentarianism"}).build()
i.exports=s,i.exports.el=o.el,i.exports.description=t("./description.html"),s.on("console/expression",function(e){o.set("label",e[0])})}),require.register("filters/index.js",function(e,t,i){var r=t("brick"),n=t("./filters.html"),s=r.box(),o=r(n,{})
o.add("model",t("input-brick")),o.filter("hello",function(e){return"hello "+e+"!"}),o.filter("uppercase",function(e){return e.toUpperCase()}),o.build(),i.exports=s,i.exports.el=o.el,i.exports.description=t("./description.html"),s.on("console/hello",function(e){o.set(e[0],e[1])})}),require.register("bredele-hidden-brick/index.js",function(e,t,i){function r(e,t){t?n(e).remove("hidden"):n(e).add("hidden")}var n=t("classes")
i.exports=function(e,t){var i="!"===t[0]
i&&(t=t.substring(1)),this.on("change "+t,function(t){r(e,i?!t:t)})}}),require.register("todo/index.js",function(e,t,i){function r(e){return function(t){var i=0
e.call(null,t.parentElement,t),u.loop(function(e){"pending"===e.get("status")&&i++}),c.set("items",u.store.data.length),c.set("pending",i)}}var n=t("brick"),s=t("./todo.html"),o=t("repeat-brick"),l=t("store"),a=n.box(),c=n(s,{items:0,pending:0}),u=o(new l([]))
c.compute("completed",function(){return this.items-this.pending})
var h={add:r(function(e,t){var i=t.value
i&&(u.add({status:"pending",label:i}),t.value="")}),toggle:r(function(e,t){u.set(e,{status:t.checked?"completed":"pending"})}),toggleAll:r(function(e,t){var i=t.checked?"completed":"pending"
u.loop(function(e){e.set("status",i)})}),delAll:r(function(){u.del(function(e){return"completed"===e.get("status")})}),del:r(function(e){u.del(e)})}
c.add("todos",u),c.add("events",t("events-brick")(h)),c.add("visible",t("hidden-brick")),c.build(),a.on("console/todo",function(e,t){for(var i=new Date,r=[],n=e[0];n--;)r.push({status:"pending",label:e[1]})
u.store.reset(r),t("benchmark "+e[0]+" items: "+(new Date-i)+"ms")}),i.exports=a,i.exports.el=c.el,i.exports.description=t("./description.html")}),require.register("svg/index.js",function(e,t,i){var r=t("brick"),n=t("./svg.html"),s=r.box(),o=r(n,{label:"hello"})
o.add("model",t("input-brick")),o.build(),i.exports=s,i.exports.el=o.el,i.exports.description=t("./description.html"),s.on("console/svg",function(e){o.set(e[0],e[1])})}),require.register("console/index.js",function(e,t,i){var r=t("brick"),n=t("trim"),s=t("./console.html"),o=r.box(),l=r(s,[])
l.add("logs",t("repeat-brick")(l)),l.add("ev",t("events-brick")({send:function(e){var t=n(e.value).replace(/\s+/g," ").split(" ")
o.emit(t.shift(),t,function(e){l.set(l.data.length,{log:e})}),e.value=""}})),l.build(),i.exports=o,i.exports.el=l.el}),require.register("home/index.js",function(e,t){var i=t("./examples"),r=t("brick"),n=t("domstack"),s=t("events-brick"),o=t("search"),l=r.box(),a=new o,c=r(document.querySelector(".sidebar"),i),u=r(document.querySelector(".main")).build(),h=u.el.querySelector(".description"),p=new n(document.querySelector(".sidebar-stack")),d=c.el.querySelector(".list-examples")
p.add("examples",d,!0)
var f=t("console")
p.add("console",f.el),l.use("console",f)
var m=new n(document.querySelector(".stack"))
for(var v in i){var b=t(v)
m.add(v,b.el),l.use(v,b)}var g=r('<div class="indicator"><span></span></div>')
c.add("examples",t("repeat-brick")(c)),c.add("control",t("control-brick")({active:function(e){var t=e.getAttribute("href").substring(1)
m.show(t),u.reset(i[t]),h.innerHTML=i[t].description,g.build(e)},select:function(e){p.show(e.innerHTML.toLowerCase())}})),c.add("search",s({search:function(e){a.run(e.value)}})),c.build()
var y=c.el.querySelectorAll(".example-item")[0]
g.build(y),m.show("hello"),h.innerHTML=i.hello.description,u.reset(i.hello),l.on("console/go",function(e){var t=e[0]
m.show(t),h.innerHTML=i[t].description,u.reset(i[t]),g.build(d.querySelector("[href*="+t+"]"))})}),require.register("home/examples.js",function(e,t,i){i.exports={hello:{name:"hello",label:"Hello World!",keywords:"basic,hello,substitution",author:"brick",link:"https://github.com/bredele/lego-examples/tree/master/src/hello",description:t("hello").description},stress:{name:"stress",label:"Stress test",keywords:"basic,hello,substitution,stress,hello",author:"brick",link:"https://github.com/bredele/lego-examples/tree/master/src/stress",description:t("stress").description},computed:{name:"computed",label:"Computed properties",keywords:"computed,properties,substitution",author:"brick",link:"https://github.com/bredele/lego-examples/tree/master/src/computed",description:t("computed").description},expressions:{name:"expressions",label:"Expressions",keywords:"expressions.substitution,bracket",author:"brick",link:"https://github.com/bredele/lego-examples/tree/master/src/expressions",description:t("expressions").description},filters:{name:"filters",label:"Filters",keywords:"filters,expressions.substitution,bracket",author:"brick",link:"https://github.com/bredele/lego-examples/tree/master/src/filters",description:t("filters").description},todo:{name:"todo",label:"Todo MVC",keywords:"todo,mvc",author:"brick",link:"https://github.com/bredele/lego-examples/tree/master/src/todo",description:t("todo").description},svg:{name:"svg",label:"svg",keywords:"hello,svg,vectoriel",author:"brick",link:"https://github.com/bredele/lego-examples/tree/master/src/svg",description:t("svg").description}}})