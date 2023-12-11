import { InvalidOperationError } from '@potentiel-domain/core';

export class GestionnaireRéseauInconnuError extends InvalidOperationError {
  constructor() {
    super(`Le gestionnaire de réseau n'est pas référencé`);
  }
}
