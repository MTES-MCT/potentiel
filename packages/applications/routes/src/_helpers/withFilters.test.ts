import { describe, it } from 'node:test';

import { expect } from 'chai';

import { withFilters } from './withFilters.js';

describe(withFilters.name, () => {
  it('should accept no parameters', () => {
    expect(withFilters('/base')()).to.equal('/base');
  });
  it('should accept string parameters', () => {
    expect(withFilters<{ foo: string }>('/base')({ foo: 'bar' })).to.equal('/base?foo=bar');
  });
  it('should accept multiple string parameters', () => {
    expect(withFilters<{ foo: string[] }>('/base')({ foo: ['bar', 'baz'] })).to.equal(
      '/base?foo=bar%7Cbaz',
    );
  });
  it('should accept boolean parameters', () => {
    expect(withFilters<{ foo: boolean }>('/base')({ foo: true })).to.equal('/base?foo=true');
  });
  it('should accept undefined boolean parameters', () => {
    expect(withFilters<{ foo?: boolean }>('/base')({ foo: undefined })).to.equal('/base');
  });
});
