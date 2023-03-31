export class GestionnaireRéseauDéjàExistantError extends Error {
  constructor() {
    super('Le gestionnaire de réseau existe déjà');
  }
}
