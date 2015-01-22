import invariant from 'invariant';
import Registry from './registry.js';

class Container {

  constructor(registry) {
    this.cache = {};
    this.factoryCache = {};
    this._registry = registry || new Registry();
  }

  lookup(fullName, options) {
    invariant(
      this._registry.validateFullName(fullName),
      'fullName must be a proper full name'
    );
    return lookup(this, this._registry.normalize(fullName), options);
  }

};

let lookup = (container, fullName, options) => {
  options = options || {};

  if (container.cache[fullName] && options.singleton !== false) {
    return container.cache[fullName];
  }

  var value = instantiate(container, fullName);

  if (value === undefined) { return; }

  if (container._registry.getOption(fullName, 'singleton') !== false && options.singleton !== false) {
    container.cache[fullName] = value;
  }

  return value;
}


let factoryFor = (container, fullName) => {
  var cache = container.factoryCache;
  if (cache[fullName]) {
    return cache[fullName];
  }
  var registry = container._registry;
  var factory = registry.resolve(fullName);
  if (factory === undefined) { return; }

  var type = fullName.split(':')[0];

  // TODO: determine is this behavior is correct
  if (!factory || typeof factory === 'function') {
    if (factory && typeof factory._onLookup === 'function') {
      factory._onLookup(fullName);
    }

    // TODO: think about a 'safe' merge style extension
    // for now just fallback to create time injection
    cache[fullName] = factory;
    return factory;

  } else {
    var injections = injectionsFor(container, fullName);
    var factoryInjections = factoryInjectionsFor(container, fullName);

    factoryInjections._toString = registry.makeToString(factory, fullName);

    var injectedFactory = factory.extend(injections);
    injectedFactory.reopenClass(factoryInjections);

    if (factory && typeof factory._onLookup === 'function') {
      factory._onLookup(fullName);
    }

    cache[fullName] = injectedFactory;

    return injectedFactory;
  }
}

let instantiate = (container, fullName) => {
  var factory = factoryFor(container, fullName);
  var lazyInjections, validationCache;

  if (container._registry.getOption(fullName, 'instantiate') === false) {
    return factory;
  }

  if (factory) {
    if (typeof factory !== 'function') {
      throw new Error('Failed to create an instance of \'' + fullName + '\'. ' +
      'Most likely an improperly defined class or an invalid module export.');
    }

    return Object.create(factory.prototype);
  }
}

let buildInjections = (container) => {
  var hash = {};

  if (arguments.length > 1) {
    var injectionArgs = Array.prototype.slice.call(arguments, 1);
    var injections = [];
    var injection;

    for (var i = 0, l = injectionArgs.length; i < l; i++) {
      if (injectionArgs[i]) {
        injections = injections.concat(injectionArgs[i]);
      }
    }

    container._registry.validateInjections(injections);

    for (i = 0, l = injections.length; i < l; i++) {
      injection = injections[i];
      hash[injection.property] = lookup(container, injection.fullName);
    }
  }

  return hash;
}

let injectionsFor = (container, fullName) => {
  var registry = container._registry;
  var splitName = fullName.split(':');
  var type = splitName[0];

  console.log(registry.typeInjections[type], registry.injections[fullName])

  var injections = buildInjections(container,
                                   registry.typeInjections[type],
                                   registry.injections[fullName]);
  injections._debugContainerKey = fullName;
  injections.container = container;

  return injections;
}

let factoryInjectionsFor = (container, fullName) => {
  var registry = container._registry;
  var splitName = fullName.split(':');
  var type = splitName[0];

  var factoryInjections = buildInjections(container,
                                          registry.factoryTypeInjections[type],
                                          registry.factoryInjections[fullName]);
  factoryInjections._debugContainerKey = fullName;

  return factoryInjections;
}

export default Container;
