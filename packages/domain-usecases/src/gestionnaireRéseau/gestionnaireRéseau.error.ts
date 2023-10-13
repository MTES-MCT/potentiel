import { InvalidOperationError, NotFoundError } from '@potentiel-domain/core';

export class GestionnaireRéseauDéjàExistantError extends InvalidOperationError {
  constructor() {
    super('Le gestionnaire de réseau existe déjà');
  }
}

export class GestionnaireRéseauInconnuError extends NotFoundError {
  constructor() {
    super(`Le gestionnaire de réseau n'est pas référencé`);
  }
}
