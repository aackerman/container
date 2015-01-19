## container

Container, Registry, Resolver Dependency Injection.

Lifted from Ember and modified to work without certain Ember assumptions and dependencies.

A Container retains a cache of instance objects, a Registry retains a cache of constructor/factory objects and type injections, a Resolver is used to locate constructor/factory objects on a global namespace or within a module system. This allows mapping a `type:name` formatted string to a value on a global namespace or an exported module value.

### Resolving on a namespace

```
class App extends Namespace {
  constructor(options) {
    super(options);
  }
  getSerializer() {
    return this.__container__.lookup('serializers:application', {
      singleton: false
    });
  }
};

App.ApplicationSerializer = function(){};

var app = new App();
var s = app.getSerializer();
s instanceof App.ApplicationSerializer; // true
```
