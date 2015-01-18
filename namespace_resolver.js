import invariant from 'invariant';
import get from 'object-get';
import {classify} from './strings.js';

class NamespaceResolver {

  constructor(namespace) {
    this.namespace = namespace;
  }

  normalize(fullName) {
    var split = fullName.split(':', 2);
    var type = split[0];
    var name = split[1];

    invariant(
      split.length === 2,
      "Tried to normalize a container name without a colon (:) in it." +
      " You probably tried to lookup a name that did not contain a type," +
      " a colon, and a name. A proper lookup name would be `type:name`."
    );

    var result = name;

    if (result.indexOf('.') > -1) {
      result = result.replace(/\.(.)/g, function(m) {
        return m.charAt(1).toUpperCase();
      });
    }

    if (name.indexOf('_') > -1) {
      result = result.replace(/_(.)/g, function(m) {
        return m.charAt(1).toUpperCase();
      });
    }

    return type + ':' + result;
  }

  resolve(parsedName) {
    var parsedName = this.parseName(fullName);
    var resolveMethodName = parsedName.resolveMethodName;
    var resolved;

    if (!(parsedName.name && parsedName.type)) {
      throw new TypeError('Invalid fullName: `' + fullName + '`, must be of the form `type:name` ');
    }

    if (this[resolveMethodName]) {
      resolved = this[resolveMethodName](parsedName);
    }

    if (!resolved) {
      resolved = this.resolveOther(parsedName);
    }

    return resolved;
  }

  parseName(fullName) {
    return this._parseNameCache[fullName] || (
      this._parseNameCache[fullName] = this._parseName(fullName)
    );
  }

  _parseName(fullName) {
    var nameParts = fullName.split(':');
    var type = nameParts[0];
    var fullNameWithoutType = nameParts[1];
    var name = fullNameWithoutType;
    var namespace = get(this, 'namespace');
    var root = namespace;

    return {
      fullName: fullName,
      type: type,
      fullNameWithoutType: fullNameWithoutType,
      name: name,
      root: root,
      resolveMethodName: 'resolve' + classify(type)
    };
  }

  lookupDescription(fullName) {
    return [
      this.parseName(fullName).root,
      '.',
      classify(parsedName.name),
      classify(parsedName.type)
    ].join('');
  }

  makeToString(factory) {
    return factory.toString();
  }

  resolveOther(parsedName) {
    var className = classify(parsedName.name) + classify(parsedName.type);
    var factory = get(parsedName.root, className);
    if (factory) { return factory; }
  }
}

export default NamespaceResolver;
