import { InvalidOperationError } from '@potentiel-domain/core';

export class GestionnaireRéseauDéjàExistantError extends InvalidOperationError {
  constructor() {
    super('Le gestionnaire de réseau existe déjà');
  }
}
