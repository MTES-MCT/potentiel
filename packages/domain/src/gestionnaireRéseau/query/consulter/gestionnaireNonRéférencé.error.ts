import { NotFoundError } from '@potentiel/core-domain';

export class GestionnaireNonRéférencéError extends NotFoundError {
  constructor(codeEIC: string) {
    super(`Le gestionnaire de réseau n'est pas référencé`, { codeEIC });
  }
}
