export class FichierInexistant extends Error {
  constructor() {
    super(`Le fichier n'existe pas`);
  }
}
