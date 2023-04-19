export class ProjetInconnuError extends Error {
  constructor() {
    super(`Le projet n'existe pas`);
  }
}
