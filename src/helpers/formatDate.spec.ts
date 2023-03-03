import { formatDate } from './formatDate';

describe('méthode formatDate', () => {
  const date = new Date('2023-01-01');
  const dateTime = date.getTime();
  it(`Lorsque la méthode est appelée sans format de date spécifié
    Alors la date retournée doit respecté le format de date par défaut (dd/MM/yyyy)`, () => {
    expect(formatDate(date)).toStrictEqual('01/01/2023');
    expect(formatDate(dateTime)).toStrictEqual('01/01/2023');
  });

  it(`Lorsque la méthode est appelée avec un format de date spécifié
    Alors la date retournée doit respecter ce format`, () => {
    expect(formatDate(date, 'dd-MM-yyyy')).toStrictEqual('01-01-2023');
    expect(formatDate(dateTime, 'dd-MM-yyyy')).toStrictEqual('01-01-2023');
    expect(formatDate(date, 'd MMMM yyyy')).toStrictEqual('1 janvier 2023');
    expect(formatDate(dateTime, 'dd/MM/yyyy HH:mm')).toStrictEqual('01/01/2023 01:00');
  });
});
