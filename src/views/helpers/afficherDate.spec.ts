import { afficherDate } from './afficherDate';

describe('méthode afficherDate', () => {
  it(`Lorsque la méthode est appelée pour une date ou un timestamp 
    Alors la date retournée doit respecté le format de date par défaut (dd/MM/yyyy)`, () => {
    const date = new Date('2023-01-01');
    expect(afficherDate(date)).toStrictEqual('01/01/2023');
    expect(afficherDate(date.getTime())).toStrictEqual('01/01/2023');
  });
});
