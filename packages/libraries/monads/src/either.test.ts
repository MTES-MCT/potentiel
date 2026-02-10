import { describe, it } from 'node:test';
import assert from 'node:assert';

import { Either } from './index.js';

import { Right, right } from './either/right.js';
import { Left, left } from './either/left.js';

describe(`Either`, () => {
  it(`Lorsque qu'une valeur est définie
      Alors Either est de type Right
      Et la valeur contenue est la même`, () => {
    const value = 'isValue';
    const actual = Either.value(value);

    const expected: Right<string> = {
      type: right,
      value,
    };

    assert.deepStrictEqual(actual, expected);
  });

  it(`Lorsque qu'une erreur est définie
      Alors Either est de type Left
      Et l'erreur contenue est la même`, () => {
    const error = new Error('Une erreur est survenue');
    const actual = Either.error(error);

    const expected: Left<Error> = {
      type: left,
      error,
    };

    assert.deepStrictEqual(actual, expected);
  });

  it(`Lorsque qu'une valeur est définie
      Alors isValue renvoi true`, () => {
    const value = 'isValue';
    const actual = Either.isValue(Either.value(value));

    const expected = true;
    assert.equal(actual, expected);
  });

  it(`Lorsque qu'une erreur est définie
      Alors isErreur renvoi true`, () => {
    const error = new Error('Une erreur est survenue');
    const actual = Either.isError(Either.error(error));

    const expected = true;
    assert.equal(actual, expected);
  });

  it(`Lorsque qu'une valeur est définie
      Alors isError renvoi false`, () => {
    const value = 'isValue';
    const actual = Either.isValue(Either.value(value));

    const expected = true;
    assert.equal(actual, expected);
  });

  it(`Lorsque qu'une erreur est définie
      Alors isValue renvoi true`, () => {
    const error = new Error('Une erreur est survenue');
    const actual = Either.isError(Either.error(error));

    const expected = true;
    assert.equal(actual, expected);
  });
});
