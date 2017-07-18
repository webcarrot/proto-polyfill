/* global describe it chai beforeEach */

describe("core", function() {
  var assert = chai.assert;
  var CoreParent,
    CoreTest,
    coreTest;

  beforeEach(function() {
    CoreParent = function() {}
    CoreParent.staticFunction = function() {
      return 1;
    };
    CoreParent.staticValue = 2;
    Object.defineProperty(CoreParent, "staticGetter", {
      get: function() {
        return "static";
      },
      configurable: true
    });
    // CoreTest
    CoreTest = function() {
      return CoreTest.__proto__.apply(this, arguments);
    }
    CoreTest.__proto__ = CoreParent;
    CoreTest.prototype = Object.create(CoreParent.prototype);
    coreTest = new CoreTest();
  });


  describe("coreTest instanceof CoreParent", function() {
    it("should return true", function() {
      assert.equal(coreTest instanceof CoreParent, true);
    });
  });

  describe("coreTest instanceof CoreTest", function() {
    it("should return true", function() {
      assert.equal(coreTest instanceof CoreTest, true);
    });
  });

  describe("coreTest.__proto__ === CoreTest.prototype", function() {
    it("should return true", function() {
      assert.equal(coreTest.__proto__ === CoreTest.prototype, true);
    });
  });

  describe("coreTest.__proto__.__proto__ === CoreTest.prototype.__proto__", function() {
    it("should return true", function() {
      assert.equal(coreTest.__proto__.__proto__ === CoreTest.prototype.__proto__, true);
    });
  });

  describe("CoreTest.prototype.__proto__ === CoreParent.prototype", function() {
    it("should return true", function() {
      assert.equal(CoreTest.prototype.__proto__ === CoreParent.prototype, true);
    });
  });

  describe("CoreTest.staticFunction === CoreParent.staticFunction", function() {
    it("should return true", function() {
      assert.equal(CoreTest.staticFunction === CoreParent.staticFunction, true);
    });
  });

  describe("override CoreTest.staticFunction", function() {
    function staticFunctionOverride() {
      return -1;
    }
    beforeEach(function() {
      CoreTest.staticFunction = staticFunctionOverride;
    });
    it("should return true", function() {
      assert.equal(CoreTest.staticFunction === staticFunctionOverride, true);
    });
    it("should return false", function() {
      assert.equal(CoreTest.staticFunction === CoreParent.staticFunction, false);
    });
    it("should return -1", function() {
      assert.equal(CoreTest.staticFunction(), -1);
    });
    it("should return 1", function() {
      assert.equal(CoreParent.staticFunction(), 1);
    });
  });

  describe("CoreTest.staticValue === CoreParent.staticValue", function() {
    it("should return true", function() {
      assert.equal(CoreTest.staticValue === CoreParent.staticValue, true);
    });
    it("should return 2", function() {
      assert.equal(CoreTest.staticValue, 2);
    });
  });

  describe("update CoreParent.staticValue", function() {
    beforeEach(function() {
      CoreParent.staticValue = 4;
    });
    it("should return true", function() {
      assert.equal(CoreTest.staticValue === CoreParent.staticValue, true);
    });
    it("should return 4", function() {
      assert.equal(CoreTest.staticValue, 4);
    });
    it("should return 4", function() {
      assert.equal(CoreParent.staticValue, 4);
    });
  });

  describe("update CoreTest.staticValue", function() {
    beforeEach(function() {
      CoreTest.staticValue = 3;
    });
    it("should return false", function() {
      assert.equal(CoreTest.staticValue === CoreParent.staticValue, false);
    });
    it("should return 3", function() {
      assert.equal(CoreTest.staticValue, 3);
    });
    it("should return 2", function() {
      assert.equal(CoreParent.staticValue, 2);
    });
  });

  describe("update staticValue", function() {
    beforeEach(function() {
      CoreTest.staticValue = 33;
      CoreParent.staticValue = 44;
    });
    it("should return false", function() {
      assert.equal(CoreTest.staticValue === CoreParent.staticValue, false);
    });
    it("should return 33", function() {
      assert.equal(CoreTest.staticValue, 33);
    });
    it("should return 44", function() {
      assert.equal(CoreParent.staticValue, 44);
    });
  });

  describe("CoreTest.staticGetter === CoreParent.staticGetter", function() {
    it("should return true", function() {
      assert.equal(CoreTest.staticGetter === CoreParent.staticGetter, true);
    });
    it("should return static", function() {
      assert.equal(CoreTest.staticGetter, "static");
    });

  });


  describe("update CoreParent.staticGetter", function() {
    beforeEach(function() {
      Object.defineProperty(CoreParent, "staticGetter", {
        get: function() {
          return "static update";
        }
      });
    });
    it("should return true", function() {
      assert.equal(CoreTest.staticGetter === CoreParent.staticGetter, true);
    });
  });

  describe("override CoreTest.staticValue", function() {
    beforeEach(function() {
      Object.defineProperty(CoreTest, "staticGetter", {
        get: function() {
          return "static override";
        }
      });
    });
    it("should return false", function() {
      assert.equal(CoreTest.staticGetter === CoreParent.staticGetter, false);
    });
    it("should return static override", function() {
      assert.equal(CoreTest.staticGetter, "static override");
    });
    it("should return static", function() {
      assert.equal(CoreParent.staticGetter, "static");
    });
  });

});
