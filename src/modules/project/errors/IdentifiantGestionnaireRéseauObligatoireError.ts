export class IdentifiantGestionnaireRéseauObligatoireError extends Error {
  constructor() {
    super(`L'identifiant gestionnaire réseau est obligatoire pour choisir ce cahier des charges`)
  }
}
