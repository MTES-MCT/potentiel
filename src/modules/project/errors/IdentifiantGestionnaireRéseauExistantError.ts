export class IdentifiantGestionnaireRéseauExistantError extends Error {
  constructor() {
    super(`L'identifiant gestionnaire réseau saisi correspond à un autre projet`)
  }
}
