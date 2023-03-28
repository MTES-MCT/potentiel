export class GestionnaireRéseauInconnuError extends Error {
  constructor() {
    super(`Le gestionnaire réseau n'existe pas`);
  }
}
