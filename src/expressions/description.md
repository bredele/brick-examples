Expressions in [lego](http://github.com/bredele/lego) are a strict subset of the JavaScript language. You can use logical operators, paths, etc.

Here's an example:


```html
<span>The string {{label}} has {{ label.length }} character {{ label.length !== 1 ? 's' : '' }}</span>
```