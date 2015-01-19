import Registry from '../registry.js';

describe('Registry', () => {

  it('returns a registered factory from resolve', () => {
    var registry = new Registry();
    var HamConstructor = function(){ this.ham = 'delicious'; };
    registry.register('constructor:ham', HamConstructor);
    var ResolvedHamConstructor = registry.resolve('constructor:ham');
    expect(ResolvedHamConstructor).not.toBe(undefined);
    expect(new ResolvedHamConstructor() instanceof HamConstructor).toBe(true);
  });

});
