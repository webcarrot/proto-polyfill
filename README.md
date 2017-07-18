# proto-polyfill

Provide `__proto__` with some limitations

## installation

``npm install --save-dev proto-polyfill``

And use like polyfill...

## limitations

Look at ./tests/limitations.js

```js
var x = {
  a: "xa"
};
function X() {

}
X.prototype.a = "Xa";
X.prototype.cv = "XCV";
X.prototype.ab = function() {
  return "ab:" + this.a;
};
Object.defineProperty(X.prototype, "c", {
  get: function() {
    return this.ab() + ":" + this.cv;
  }
})
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

## tests

`./tests/index.html`

PR welcome.
