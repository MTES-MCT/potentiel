import { afficherDate } from './afficherDate';

describe('Afficher une date', () => {
  const date = new Date('2023-01-01');

  it(`Lorsqu'on affiche une date au format JJ/MM/AAAA à partir d'une date
    Alors la chaîne de caractère retournée doit respecter le format de date par défaut (dd/MM/yyyy)`, () => {
    expect(afficherDate(date)).toStrictEqual('01/01/2023');
  });

  it(`Lorsqu'on affiche une date au format JJ/MM/AAAA à partir d'un timestamp
    Alors la chaîne de caractère retournée doit respecter le format de date par défaut (dd/MM/yyyy)`, () => {
    expect(afficherDate(date.getTime())).toStrictEqual('01/01/2023');
  });
});
