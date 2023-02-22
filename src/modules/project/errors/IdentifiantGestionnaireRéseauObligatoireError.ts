export class IdentifiantGestionnaireRéseauObligatoireError extends Error {
  constructor() {
    super(`L'identifiant gestionnaire de réseau est obligatoire`);
  }
}
