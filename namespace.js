import NamespaceResolver from './namespace_resolver.js';

class Namespace {
  constructor(options) {
    this.__registry__ = new Registry();
    this.__container__ = this.__registry__.container;
    this.Resolver = options.Resolver || NamespaceResolver;
  }

  register() {
    var registry = this.__registry__;
    registry.register.apply(registry, arguments);
  }
}

export default Namespace;
