(function(O, F) {
  "use strict";

  var O_PROTO = "__proto__";
  var P_PROTO = "___proto_polyfill_proto___";
  var P_FUNCT = "___proto_polyfill_funct___";
  var P_VALUE = "___proto_polyfill_value___";

  var getOwnPropertyNames = O["getOwnPropertyNames"];
  var defineProperty = O["defineProperty"];
  var getOwnPropertyDescriptor = O["getOwnPropertyDescriptor"];

  function prepareFunction(dest, func) {
    var sourceFunction = func[P_FUNCT] || func;
    var newFunction = sourceFunction.bind(dest);
    defineProperty(newFunction, P_FUNCT, {
      value: sourceFunction,
      enumerable: false,
      configurable: false,
      writable: false
    });
    return newFunction;
  }

  function setProperty(dest, source, name) {
    var info = getOwnPropertyDescriptor(source, name);
    var hasSetter = info.set instanceof F;
    var hasGetter = info.get instanceof F;
    if (hasSetter && hasGetter) {
      defineProperty(dest, name, {
        set: prepareFunction(dest, info.set),
        get: prepareFunction(dest, info.get),
        enumerable: info.enumerable || false,
        configurable: true
      });
    } else if (hasSetter) {
      defineProperty(dest, name, {
        set: prepareFunction(dest, info.set),
        enumerable: info.enumerable || false,
        configurable: true
      });
    } else if (hasGetter) {
      defineProperty(dest, name, {
        get: prepareFunction(dest, info.get),
        enumerable: info.enumerable || false,
        configurable: true
      });
    } else {
      defineProperty(dest, name, {
        set: function(v) {
          this[P_VALUE][name] = v;
        },
        get: function() {
          return name in this[P_VALUE] ? this[P_VALUE][name] : source[name];
        },
        enumerable: info.enumerable || false,
        configurable: true
      });
    }
  }

  function setProto(dest, source) {
    defineProperty(dest, P_PROTO, {
      value: source,
      enumerable: false,
      configurable: false,
      writable: false
    });
    defineProperty(dest, P_VALUE, {
      value: {},
      enumerable: false,
      configurable: false,
      writable: false
    });
    var names = getOwnPropertyNames(source),
      name,
      n = 0;
    for (; n < names.length; n++) {
      name = names[n];
      if (name && name !== O_PROTO && name !== P_PROTO && name !== P_FUNCT && name !== P_VALUE && !dest.hasOwnProperty(name)) {
        setProperty(dest, source, name);
      }
    }
  }

  if (O[O_PROTO] === undefined && getOwnPropertyNames instanceof F && defineProperty instanceof F && getOwnPropertyDescriptor instanceof F) {
    defineProperty(F.prototype, O_PROTO, {
      get: function() {
        return this[P_PROTO] || F;
      },
      set: function(source) {
        setProto(this, source);
      }
    });
  }

})(Object, Function);