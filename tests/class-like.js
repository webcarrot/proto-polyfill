/* global describe it chai */

describe("class-like", function() {
  var assert = chai.assert;

  // Babel like env...
  var _get = function get(object, property, receiver) {
    if (object === null)
      object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);
      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return getter.call(receiver);
    }
  };
  var defineProperty = Object["defineProperty"];
  var setPrototypeOf = Object["setPrototypeOf"];
  function makeClass(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: false,
        configurable: true
      }
    });
    if (setPrototypeOf) {
      setPrototypeOf(subClass, superClass);
    } else {
      subClass.__proto__ = superClass;
    }
  }

  function X() {
  }

  defineProperty(X.prototype, "foo", {
    get: function() {
      return this.constructor.foo + " by instance!";
    },
    enumerable: false,
    configurable: true
  });

  defineProperty(X, "foo", {
    get: function() {
      return "xFoo";
    },
    enumerable: false,
    configurable: true
  });

  X.s = {
    s: "x"
  };
  X.f = "X";

  function Y() {
    return Y.__proto__.apply(this, arguments);
  }

  makeClass(Y, X);

  Y.s = {
    s: "y"
  };
  Y.f = "Y";

  defineProperty(Y, "foo", {
    get: function() {
      return this.__proto__.foo + " > yFoo";
    },
    enumerable: false,
    configurable: true
  });

  function Z() {
    return Z.__proto__.apply(this, arguments);
  }

  makeClass(Z, Y);

  Z.f = "Z";

  defineProperty(Z, "foo", {
    get: function() {
      return this.__proto__.foo + " > zFoo";
    },
    enumerable: false,
    configurable: true
  });

  defineProperty(Z.prototype, "foo", {
    get: function() {
      return "My special Z foo " + _get(Z.prototype.__proto__, "foo", this);
    },
    enumerable: false,
    configurable: true
  });

  var x = new X();
  var y = new Y();
  var z = new Z();

  describe("x instanceof X", function() {
    it("should return true", function() {
      assert.equal(x instanceof X, true);
    });
  });

  describe("y instanceof X", function() {
    it("should return true", function() {
      assert.equal(y instanceof X, true);
    });
  });

  describe("y instanceof Y", function() {
    it("should return true", function() {
      assert.equal(y instanceof Y, true);
    });
  });

  describe("z instanceof X", function() {
    it("should return true", function() {
      assert.equal(z instanceof X, true);
    });
  });

  describe("z instanceof Y", function() {
    it("should return true", function() {
      assert.equal(z instanceof Y, true);
    });
  });

  describe("z instanceof Z", function() {
    it("should return true", function() {
      assert.equal(z instanceof Z, true);
    });
  });

  describe("x instanceof Z", function() {
    it("should return false", function() {
      assert.equal(x instanceof Z, false);
    });
  });

  describe("x.foo", function() {
    it("should return xFoo by instance!", function() {
      assert.equal(x.foo, "xFoo by instance!");
    });
  });

  describe("y.foo", function() {
    it("should return xFoo > yFoo by instance!", function() {
      assert.equal(y.foo, "xFoo > yFoo by instance!");
    });
  });

  describe("z.foo", function() {
    it("should return My special Z foo xFoo > yFoo > zFoo by instance!", function() {
      assert.equal(z.foo, "My special Z foo xFoo > yFoo > zFoo by instance!");
    });
  });

  describe("x.constructor", function() {
    it("s.s should return x!", function() {
      assert.equal(x.constructor.s.s, "x");
    });
    it("f should return X!", function() {
      assert.equal(x.constructor.f, "X");
    });
  });

  describe("y.constructor", function() {
    it("s.s should return y!", function() {
      assert.equal(y.constructor.s.s, "y");
    });
    it("f should return Y!", function() {
      assert.equal(y.constructor.f, "Y");
    });
  });

  describe("z.constructor", function() {
    it("s.s should return y!", function() {
      assert.equal(z.constructor.s.s, "y");
    });
    it("f should return Z!", function() {
      assert.equal(z.constructor.f, "Z");
    });
  });

});
