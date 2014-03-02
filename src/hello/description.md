Let's start with the famous hello world! [Lego](http://github.com/bredele/lego) allows you to substitute variables into a template string or a dom element as following:

```html
<div class="lego">
	<style>
	  .brick {
	  	color: {{ color }};
	  }
	</style>
	<span class="brick">{{ label }}</span>
</div>
```
Nothing more simple! 

```js
var view = lego(tmpl).build();
view.set('label', 'Hello');
```

  > **Tips**: type **`hello color blue`** or **`hello label world`** in the console to update the demo!