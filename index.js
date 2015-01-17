immport Registry from './registry';

class Container {
  constructor(registry) {
    this._registry = registry || new Registry();
  }
  register(fullName, factory, options) {

  }
  lookup(fullName, options) {

  }
  unregister() {

  }
};

export default Container;
