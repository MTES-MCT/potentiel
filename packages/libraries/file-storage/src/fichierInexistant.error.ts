export class FichierInexistant extends Error {
  constructor(filePath?: string) {
    super(`Le fichier ${filePath} n'existe pas`);
  }
}
