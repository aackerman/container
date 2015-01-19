import invariant from 'invariant';

var VALID_FULL_NAME_REGEXP = /^[^:]+.+:[^:]+$/;

class Registry {
  constructor(options) {
    this.resolver = options && options.resolver ? options.resolver : function() {};
    this.registrations = {};
    this._resolveCache = {};
    this._normalizeCache = {};
    this._options = {};
  }

  container(options) {
    return new Container(this, options);
  }

  validateFullName(fullName) {
    if (!VALID_FULL_NAME_REGEXP.test(fullName)) {
      throw new TypeError('Invalid Fullname, expected: `type:name` got: ' + fullName);
    }
    return true;
  }

  normalizeFullName(fullName) {
    return fullName;
  }

  normalize(fullName) {
    return this._normalizeCache[fullName] || (
        this._normalizeCache[fullName] = this.normalizeFullName(fullName)
      );
  }

  resolve(fullName) {
    invariant(
      this.validateFullName(fullName),
      'fullName must be a proper full name'
    );
    return resolve(this, this.normalize(fullName));
  }

  register(fullName, factory, options) {
    invariant(
      this.validateFullName(fullName),
      'fullName must be a proper full name'
    );

    if (factory === undefined) {
      throw new TypeError('Attempting to register an unknown factory: `' + fullName + '`');
    }

    var normalizedName = this.normalize(fullName);

    if (this._resolveCache[normalizedName]) {
      throw new Error('Cannot re-register: `' + fullName +'`, as it has already been resolved.');
    }

    this.registrations[normalizedName] = factory;
    this._options[normalizedName] = (options || {});
  }

  unregister(fullName) {
    invariant(
      this.validateFullName(fullName),
      'fullName must be a proper full name'
    );

    var normalizedName = this.normalize(fullName);

    delete this.registrations[normalizedName];
    delete this._resolveCache[normalizedName];
    delete this._options[normalizedName];
  }
}

function resolve(registry, normalizedName) {
  var cached = registry._resolveCache[normalizedName];
  if (cached) { return cached; }

  var resolved = registry.resolver(normalizedName) || registry.registrations[normalizedName];
  registry._resolveCache[normalizedName] = resolved;

  return resolved;
}

function has(registry, fullName) {
  return registry.resolve(fullName) !== undefined;
}

export default Registry;
