/* global describe it chai beforeEach */

describe("LIMITATIONS", function() {
  var assert = chai.assert;
  var x ,
    iX,
    X;
  beforeEach(function() {
    x = {
      a: "xa"
    };
    X = function _X() {}
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
    x.__proto__ = X.prototype;
    iX = new X();
  });

  describe("instanceof X", function() {
    it("should return true", function() {
      assert.equal(x instanceof X, true);
    });
    it("should return true", function() {
      assert.equal(iX instanceof X, true);
    });
  });

  describe("prototype", function() {
    it("should return xa", function() {
      assert.equal(x.a, "xa");
    });
    it("should return Xa", function() {
      assert.equal(iX.a, "Xa");
    });
    it("should return ab:xa", function() {
      assert.equal(x.ab(), "ab:xa");
    });
    it("should return ab:Xa", function() {
      assert.equal(iX.ab(), "ab:Xa");
    });
    it("should return ab:xa:XCV", function() {
      assert.equal(x.c, "ab:xa:XCV");
    });
    it("should return ab:Xa:XCV", function() {
      assert.equal(iX.c, "ab:Xa:XCV");
    });
  });

  describe("override X.prototype.cv", function() {
    beforeEach(function() {
      X.prototype.cv = "XCV2";
    });
    it("should return ab:xa:XCV2", function() {
      assert.equal(x.c, "ab:xa:XCV2");
    });
    it("should return ab:Xa:XCV2", function() {
      assert.equal(iX.c, "ab:Xa:XCV2");
    });
  });

  describe("override x.cv", function() {
    beforeEach(function() {
      x.cv = "XCV3";
    });
    it("should return ab:xa:XCV3", function() {
      assert.equal(x.c, "ab:xa:XCV3");
    });
    it("should return ab:Xa:XCV", function() {
      assert.equal(iX.c, "ab:Xa:XCV");
    });
  });

  describe("add new prototype thing", function() {
    beforeEach(function() {
      X.prototype.newProp = "newProp";
    });
    it("should return newProp", function() {
      assert.equal(x.newProp, "newProp");
    });
    it("should return newProp", function() {
      assert.equal(iX.newProp, "newProp");
    });
  });

});
