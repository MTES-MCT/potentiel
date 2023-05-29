import { Readable } from 'stream';
import { convertReadableToString } from './convertReadableToString';

describe(`convertir un readable en string`, () => {
  it(`
    Quand un contenu de type readable est donné
    Alors la fonction devrait retourné la valeur du readable en string`, async () => {
    const content = "Contenu d'un fichier";
    const file = Readable.from(content, {
      encoding: 'utf8',
    });
    const résultat = await convertReadableToString(file);

    expect(résultat).toEqual(content);
  });
});
