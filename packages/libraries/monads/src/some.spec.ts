import { none } from './none';
import { isSome } from './some';

describe('isSome', () => {
  it(`Lorsque qu'une valeur est 'none'
      Alors la fonction isSome retourne false`, () => {
    // Arrange
    const value = none;

    // Act
    const actual = isSome(value);

    // Assert
    expect(actual).toBeFalsy();
  });

  it(`Lorsque qu'une valeur n'est pas 'none'
      Et la fonction isNone retourne true`, () => {
    // Arrange
    const value = {};

    // Act
    const actual = isSome(value);

    // Assert
    expect(actual).toBeTruthy();
  });
});
