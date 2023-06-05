import { NotFoundError } from '@potentiel/core-domain';

export class GestionnaireRéseauInconnuError extends NotFoundError {
  constructor() {
    super(`Le gestionnaire de réseau n'existe pas`);
  }
}
