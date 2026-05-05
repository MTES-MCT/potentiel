// L’algorithme de Luhn est une formule simple de somme de contrôle utilisée pour valider des numéros d’identification
export const applyLuhnCheck = (value: string): boolean => {
  const digits = value.split('').map(Number).reverse();
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    if (i % 2 !== 0) {
      sum += digit * 2 > 9 ? digit * 2 - 9 : digit * 2;
    } else {
      sum += digit;
    }
  }

  return sum % 10 === 0;
};
