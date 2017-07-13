# proto-polyfill

Provide evil `__proto__` for instances of Function class in old browsers ( IE 9, 10 ).

Thats allow to access inherited static methods / properties / getters / setters of class after typical babel es2015 conversion.

## installation

``npm install --save-dev proto-polyfill``

## usage

Idiotic example:

```js
"use strict";
 // In real life import polyfill in webpack or something like that...
import "proto-polyfill";

class Foo {
  static _yName = "yFoo";
  static get xName() {
    return "xFoo";
  }
  static get yName() {
    return this._yName;
  }
  static set yName(v) {
    this._yName = v;
  }
  static xExecute(label) {
    console.log(label, this.xName, this.yName);
  }
  get instanceXName() {
    return this.constructor.xName;
  }
  instanceXExecute(label) {
    this.constructor.xExecute(label);
  }
}

class Bar extends Foo {
  static get xName() {
    return "xBar";
  }
  set y(v) {
    this.constructor.yName = v;
  }
}

class FooUfo extends Foo {
  static get yName() {
    return super.yName;
  }
  static set yName(v) {
    super.yName = v + " UFO!";
  }
  static xExecute(label) {
    console.log(label, this.xName, this.yName, "more UFO!");
  }
}

class BarUfo extends Bar {
  static xExecute(label) {
    super.xExecute("Ufo ufo <" + label + ">");
  }
}

const f = new Foo();
const b1 = new Bar();
const b2 = new Bar();
const fUfo = new FooUfo();
const barUfo = new BarUfo();

f.instanceXExecute("f");
Foo.xExecute("Foo");
b1.instanceXExecute("b1");
b2.instanceXExecute("b2");
Bar.xExecute("Bar");
fUfo.instanceXExecute("fUfo");
FooUfo.xExecute("FooUfo");
barUfo.instanceXExecute("barUfo");
BarUfo.xExecute("BarUfo");
b2.y = "New y";
FooUfo.yName = "xUfo is";
f.instanceXExecute("f");
Foo.xExecute("Foo");
b1.instanceXExecute("b1");
b2.instanceXExecute("b2");
Bar.xExecute("Bar");
fUfo.instanceXExecute("fUfo");
FooUfo.xExecute("FooUfo");
barUfo.instanceXExecute("barUfo");
BarUfo.xExecute("BarUfo");
```

Prints:

```
f xFoo yFoo
Foo xFoo yFoo
b1 xBar yFoo
b2 xBar yFoo
Bar xBar yFoo
fUfo xFoo yFoo more UFO!
FooUfo xFoo yFoo more UFO!
Ufo ufo <barUfo> xBar yFoo
Ufo ufo <BarUfo> xBar yFoo
f xFoo yFoo
Foo xFoo yFoo
b1 xBar New y
b2 xBar New y
Bar xBar New y
fUfo xFoo xUfo is UFO! more UFO!
FooUfo xFoo xUfo is UFO! more UFO!
Ufo ufo <barUfo> xBar New y
Ufo ufo <BarUfo> xBar New y
```

## limitations

__Redefinition__ of getters / setters in parent function after `__proto__` assignment to children its not supported ( IMO its waste of cpu time ).

__New__ things assigned to parent are also not handlet by children.

```js
function x() {}
function y() {}
Object.defineProperty(x, "foo", {get: function(){
  return "a";
}, configurable: true});
y.__proto__ = x;
console.log(y.foo); // prints "a";
Object.defineProperty(x, "foo", {get: function(){
  return "b";
}, configurable: true});
x.bar = "bar"
console.log(y.foo); // prints "a" ... not "b";
console.log(y.bar); // prints undefined
```

__But__ this work:

```js
function x() {}
function y() {}
x.foo = "a";
y.__proto__ = x;
console.log(y.foo); // prints "a";
x.foo = "b";
console.log(y.foo); // prints "b";
x.foo = "c";
console.log(y.foo); // prints "c";
// And if change y.foo
y.foo = "f";
console.log(x.foo); // prints "c";
console.log(y.foo); // prints "f";
x.foo = "x";
console.log(x.foo); // prints "x";
console.log(y.foo); // prints "f";
```

Assign `__proto__` only once - this example should throw exception:

```js
function x() {}
function y() {}
function z() {}
z.__proto__ = x;
z.__proto__ = y;
```

## tests ?

Tested on humans.

PR welcome.
