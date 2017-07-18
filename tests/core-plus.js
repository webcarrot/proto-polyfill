/* global describe it chai  */

describe("core+", function() {
  var assert = chai.assert;

  var native = Object.getPrototypeOf(Object);
  var e = new Error();

  describe("Error.__proto__", function() {
    it("should return function () { [native code] }", function() {
      assert.equal(Error.__proto__, native);
    });
  });

  describe("Error.__proto__.__proto__", function() {
    it("should return Object.prototype", function() {
      assert.equal(Error.__proto__.__proto__, Object.prototype);
    });
  });

  describe("Error.__proto__.__proto__.__proto__", function() {
    it("should return null", function() {
      assert.equal(Error.__proto__.__proto__.__proto__, null);
    });
  });

  describe("e.__proto__", function() {
    it("should return Error.prototype", function() {
      assert.equal(e.__proto__, Error.prototype);
    });
  });

  describe("e.__proto__.__proto__", function() {
    it("should return Object.prototype", function() {
      assert.equal(e.__proto__.__proto__, Object.prototype);
    });
  });

  describe("e.__proto__.__proto__.__proto__", function() {
    it("should return null", function() {
      assert.equal(e.__proto__.__proto__.__proto__, null);
    });
  });

  describe("(1).__proto__", function() {
    it("should return Number.prototype", function() {
      assert.equal((1).__proto__, Number.prototype);
    });
  });

  describe("(1).__proto__.__proto__", function() {
    it("should return Object.prototype", function() {
      assert.equal((1).__proto__.__proto__, Object.prototype);
    });
  });

  describe("(1).__proto__.__proto__.__proto__", function() {
    it("should return null", function() {
      assert.equal((1).__proto__.__proto__.__proto__, null);
    });
  });


});
