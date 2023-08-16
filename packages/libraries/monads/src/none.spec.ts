import { describe, expect, it } from '@jest/globals';
import { isNone, none } from './none';

describe('isNone', () => {
  it(`Lorsque qu'une valeur est 'none'
      Alors la valeur est considérée comme du type None
      Et la fonction isNone retourne true`, () => {
    // Arrange
    const value = none;

    // Act
    const actual = isNone(value);

    // Assert
    expect(actual).toBeTruthy();
  });

  it(`Lorsque qu'une valeur n'est pas 'none'
      Alors la valeur n'est pas considérée comme du type None
      Et la fonction isNone retourne false`, () => {
    // Arrange
    const value = {};

    // Act
    const actual = isNone(value);

    // Assert
    expect(actual).toBeFalsy();
  });
});
