# proto-polyfill

Provide `__proto__` with some limitations

## browsers that need this polyfill

In general old browsers that **not** provide legacy `__proto__` and **support** `Object.defineProperty`, `Object.getPrototypeOf`, `Object.getOwnPropertyNames`, `Object.getOwnPropertyDescriptor` and `Object.create`:

- IE 9
- IE 10

IE 8 is **not** supported.

### why and when

If you do things like:
./tests/class-like.js
or (ES6 version):

```js
class X {
  static get foo() {
    return "xFoo";
  }
  get foo() {
    return this.constructor.foo + " by instance!";
  }
}
X.s = { s: "x" };
X.f = "X";
class Y extends X {
  static get foo() {
    return this.__proto__.foo + " > yFoo";
  }
}
Y.s = {
  s: "y"
};
Y.f = "Y";
class Z extends Y {
  static get foo() {
    return this.__proto__.foo + " > zFoo";
  }
  get foo() {
    return "My special Z foo " + super.foo;
  }
}
Z.f = "Z";
var x = new X();
var y = new Y();
var z = new Z();
console.log(x.foo); // xFoo by instance!
console.log(y.foo); // xFoo > yFoo by instance!
console.log(z.foo); // My special Z foo xFoo > yFoo > zFoo by instance!
console.log(x.constructor.s.s); // x
console.log(x.constructor.f); // X
console.log(y.constructor.s.s); // y
console.log(y.constructor.f); // Y
console.log(z.constructor.s.s); // y
console.log(z.constructor.f); // Z
```

...and code produced by compliler ( babel 6.x ) not work properly in old browsers like ie9-10.

## installation

`npm install --save-dev proto-polyfill`

And use like polyfill...

## limitations

Look at ./tests/limitations.js

```js
var x = {
  a: "xa"
};
function X() {}
X.prototype.a = "Xa";
X.prototype.cv = "XCV";
X.prototype.ab = function() {
  return "ab:" + this.a;
};
Object.defineProperty(X.prototype, "c", {
  get: function() {
    return this.ab() + ":" + this.cv;
  }
});
// no way to replace object prototype "in place" ?
x.__proto__ = X.prototype;
console.log(x instanceof X); // invalid log: false should true
// but some kind emulation works
console.log(x.a); // ok log: "xa";
console.log(x.ab()); // ok log: "ab:xa";
console.log(x.c); // ok log: "ab:xa:XCV";
// normal instance
var iX = new X();
console.log(iX instanceof X); // ok log: true
console.log(iX.a); // ok log: "Xa";
console.log(iX.ab()); // ok log: "ab:Xa";
console.log(iX.c); // ok log: "ab:Xa:XCV";
// override
X.prototype.cv = "XCV2";
console.log(x.c); // ok log: "ab:xa:XCV2";
x.cv = "XCV3";
console.log(x.c); // ok log: "ab:xa:XCV3";
// but
X.prototype.newProp = "newProp";
console.log(x.newProp); // invalid log: undefined should "newProp";
```

### Pseudo Symbol()

Pseudo `Symbol()` props are skipped (core-js Set polyfill use it)

### Object.setPrototypeOf

Only emultation

### Object.getPrototypeOf

Override to make super() work in Babel 7

## tests

`./tests/index.html`

PR welcome.
