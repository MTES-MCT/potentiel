import { InvalidOperationError } from '@potentiel/core-domain';

export class GestionnaireRéseauDéjàExistantError extends InvalidOperationError {
  constructor() {
    super('Le gestionnaire de réseau existe déjà');
  }
}
