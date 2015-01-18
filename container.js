import Registry from './registry.js';

class Container {
  constructor(registry) {
    this._registry = registry || new Registry();
  }
  lookup(fullName, options) {
    this._registry.lookup(fullName, options);
  }
};

export default Container;
