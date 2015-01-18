import NamespaceResolver from './namespace_resolver.js';

class CommonResolver extends NamespaceResolver {
  constructor(namespace) {
    this.namespace = namespace;
  }
}

export default CommonResolver;
