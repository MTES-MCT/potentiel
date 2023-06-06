import { InvalidOperationError, NotFoundError } from '@potentiel/core-domain';

export class GestionnaireRéseauDéjàExistantError extends InvalidOperationError {
  constructor() {
    super('Le gestionnaire de réseau existe déjà');
  }
}

export class GestionnaireRéseauInconnuError extends NotFoundError {
  constructor() {
    super(`Le gestionnaire de réseau n'existe pas`);
  }
}
