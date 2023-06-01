export class GestionnaireRéseauInconnuError extends Error {
  constructor() {
    super(`Le gestionnaire de réseau n'existe pas`);
  }
}
