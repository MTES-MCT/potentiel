import { afficherDateAvecHeure } from './afficherDateAvecHeure';

describe('méthode afficherDateAvecHeure', () => {
  it(`Lorsque la méthode est appelée pour une date ou un timestamp 
    Alors la date retournée doit respecté le format de date par défaut (dd/MM/yyyy HH:mm)`, () => {
    const date = new Date('2023-01-01 16:30');
    expect(afficherDateAvecHeure(date)).toStrictEqual('01/01/2023 16:30');
    expect(afficherDateAvecHeure(date.getTime())).toStrictEqual('01/01/2023 16:30');
  });
});
