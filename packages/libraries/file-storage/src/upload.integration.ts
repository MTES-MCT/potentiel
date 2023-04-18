import { upload } from './upload';

describe(`upload file`, () => {
  beforeAll(() => {
    process.env.S3_ENDPOINT = 'http://localhost:9443';
    process.env.S3_BUCKET = 'Potentiel';
  });
  it(`
    Etant donné un endpoint et un bucket
    Quand un fichier est téléversé
    Alors il devrait être récupérable depuis le bucket`, async () => {
    const filePath = 'path/to/file.pdf';
    const content = Buffer.from("Contenu d'un fichier", 'utf8');

    await upload(filePath, content);
  });
});
