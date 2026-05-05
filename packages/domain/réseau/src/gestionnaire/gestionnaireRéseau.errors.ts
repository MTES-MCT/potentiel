import { InvalidOperationError } from '@potentiel-domain/core';

export class GestionnaireRéseauDéjàExistantError extends InvalidOperationError {
  constructor() {
    super('Le gestionnaire de réseau existe déjà');
  }
}

export class GestionnaireRéseauInconnuError extends InvalidOperationError {
  constructor() {
    super(`Le gestionnaire de réseau n'est pas référencé`);
  }
}

export class GestionnaireRéseauNonModifiéError extends InvalidOperationError {
  constructor() {
    super(`Le gestionnaire de réseau n'a pas été modifié`);
  }
}
