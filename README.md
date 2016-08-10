# Polymer ES6 example

ES6 example of a Polymer app

Essentially this is a very brief example of how to setup a build process using [polymer-build](https://github.com/polymer/polymer-build) combined with babel to allow classes for elements.

## Explanation

There are two parts to this:

* The transpiler build step
* Using classes to define elements


### Transpiler step

Thanks to polymer-build, the first step is incredibly simple. We simply pipe the JavaScript of our elements through babel in our gulp task:

```javascript
const sources = project.sources()
	.pipe(project.splitHtml())
	.pipe(gulpif(/\.js$/, babel({
		presets: ['es2015']
	})))
	.pipe(project.rejoinHtml());
```

You can find this step [here](https://github.com/43081j/polymer-es6-example/blob/master/gulpfile.js#L20).

### Element classes

The second step is as simple as defining your elements as classes which extend the HTMLElement class:

```javascript
class MyElement extends HTMLElement {
	// ...
}
```

However, this won't work right away as we have no `is` property and don't have a place to specify our properties, listeners, etc.

This is where the `beforeRegister` method comes into use:

```javascript
class MyElement extends HTMLElement {
	beforeRegister() {
		this.is = 'my-element';
		this.properties = {
			// ...
		};
		this.listeners = {
			// ...
		};
	}
}
```

We can then pass our class directly into Polymer and it will be registered as usual:

```javascript
Polymer(MyElement);
```

### Future

In future, I hope the Polymer team eventually allows us to simply do:

```javascript
class MyElement extends Polymer.Base {
}
```

This would prevent us from having to modify the prototype to attach Polymer.Base onto the class (as it does now). Instead, it would inherit as you'd expect.

## Install

```
$ npm install
$ bower install
$ gulp
```

## Viewing

```
$ gulp serve
```

## Building

```
$ gulp
```
