import NamespaceResolver from './namespace_resolver.js';
import Registry from './registry.js';

class Namespace {
  constructor(options) {
    var ResolverClass = (options && options.Resolver) || NamespaceResolver;
    this.Resolver = new ResolverClass(this);
    this.buildRegistry();
    this.buildContainer();
  }

  buildRegistry() {
    return this.__registry__ = new Registry({
      resolver: this.Resolver
    });
  }

  buildContainer() {
    return this.__container__ = this.__registry__.container();
  }

  register() {
    var registry = this.__registry__;
    registry.register.apply(registry, arguments);
  }
}

export default Namespace;
