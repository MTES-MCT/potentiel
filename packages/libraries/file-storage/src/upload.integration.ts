describe(`upload file`, () => {
  beforeAll(() => {
    process.env.S3_ENDPOINT = '';
    process.env.S3_BUCKET = '';
  });
  it(`
    Etant donné un endpoint et un bucket
    Quand un fichier est téléversé
    Alors il devrait être récupérable depuis le bucket`, () => {});
});
