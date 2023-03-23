export class GestionnaireRéseauDéjàExistantError extends Error {
  constructor() {
    super('Le gestionnaire réseau existe déjà');
  }
}
