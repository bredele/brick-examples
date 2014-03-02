In [lego](http://github.com/bredele/lego) you can compute properties in two ways:

```html
<span>{{ firstName + ' ' + lastName }}</span>
```
or

```js
view.compute('name', function() {
	return this.firstName + ' ' + this.lastName;
});
```
