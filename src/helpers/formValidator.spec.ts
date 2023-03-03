import { isDateFormatValid, isStrictlyPositiveNumber } from './formValidators';

describe('isStrictlyPositiveNumber', () => {
  it('should return true for a strict positive number with .', () => {
    expect(isStrictlyPositiveNumber(1)).toBe(true);
  });
  it('should return false for undefined', () => {
    expect(isStrictlyPositiveNumber(undefined)).toBe(false);
  });
  it('should return true for a strict positive number with ,', () => {
    expect(isStrictlyPositiveNumber('1,6')).toBe(true);
  });
});

describe('méthode isDateFormatValid', () => {
  it(`Lorsque la méthode est appelée sans date ni format
  Alors le format de la date n'est pas valide et la méthode doit retourner false`, () => {
    expect(isDateFormatValid('', '')).toStrictEqual(false);
  });

  it(`Lorsque la méthode est appelée avec une date et un format mais que les deux ne coïncident pas
  Alors le format de la date n'est pas valide et la méthode doit retourner false`, () => {
    expect(isDateFormatValid('64/01/2020', 'dd/MM/yyyy')).toStrictEqual(false);
  });

  it(`Lorsque la méthode est appelée avec une date et un format et que les deux coïncident
    Alors le format de la date est valide et la méthode doit retourner true`, () => {
    expect(isDateFormatValid('01/01/2020', 'dd/MM/yyyy')).toStrictEqual(true);
  });
});
