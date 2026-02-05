import { describe, it } from 'node:test';
import assert from 'node:assert';

import { Option } from './index.js';

describe('Option', () => {
  it(`Lorsque qu'une valeur est 'none'
      Alors la valeur est considérée comme du type None
      Et la fonction isNone retourne true`, () => {
    // Arrange
    const value = Option.none;

    // Act
    const actual = Option.isNone(value);

    // Assert
    const expected = true;
    assert.strictEqual(actual, expected);
  });

  it(`Lorsque qu'une valeur n'est pas 'none'
      Alors la valeur n'est pas considérée comme du type None
      Et la fonction isNone retourne false`, () => {
    // Arrange
    const value = {};

    // Act
    const actual = Option.isNone(value);

    // Assert
    const expected = false;
    assert.strictEqual(actual, expected);
  });

  it(`Lorsque qu'une valeur est 'none'
      Alors la fonction isSome retourne false`, () => {
    // Arrange
    const value = Option.none;

    // Act
    const actual = Option.isSome(value);

    // Assert
    const expected = false;
    assert.strictEqual(actual, expected);
  });

  it(`Lorsque qu'une valeur n'est pas 'none'
      Alors la fonction isSome retourne true`, () => {
    // Arrange
    const value = {};

    // Act
    const actual = Option.isSome(value);

    // Assert
    const expected = true;
    assert.strictEqual(actual, expected);
  });
});

describe('isSome', () => {});
