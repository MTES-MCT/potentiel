import { describe, expect, it } from '@jest/globals';
import { afficherDateAvecHeure } from './afficherDateAvecHeure';

describe("Afficher une date avec l'heure", () => {
  const date = new Date('2023-01-01 16:30');
  it(`Lorsqu'on affiche une date au format JJ/MM/AAAA HH:MM à partir d'une date
    Alors la chaîne de caractère retournée doit respecter le format de date par défaut (dd/MM/yyyy HH:mm)`, () => {
    expect(afficherDateAvecHeure(date)).toStrictEqual('01/01/2023 16:30');
  });

  it(`Lorsqu'on affiche une date au format JJ/MM/AAAA HH:MM à partir d'une date
    Alors la chaîne de caractère retournée doit respecter le format de date par défaut (dd/MM/yyyy HH:mm)`, () => {
    expect(afficherDateAvecHeure(date.getTime())).toStrictEqual('01/01/2023 16:30');
  });
});
