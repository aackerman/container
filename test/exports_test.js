import pack from '../index.js';

describe('exports', () => {
  it('has all the exports', () => {
    expect(pack.Namespace).not.toBe(undefined);
    expect(pack.CommonResolver).not.toBe(undefined);
    expect(pack.AmdResolver).not.toBe(undefined);
    expect(pack.NamespaceResolver).not.toBe(undefined);
  });
});
