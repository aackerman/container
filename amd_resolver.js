import NamespaceResolver from './namespace_resolver.js';

class AmdResolver extends NamespaceResolver {
  constructor(namespace) {
    this.namespace = namespace;
  }
}

export default AmdResolver;
