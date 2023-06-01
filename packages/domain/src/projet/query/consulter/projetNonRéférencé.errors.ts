import { NotFoundError } from '@potentiel/core-domain';

export class ProjetNonRéférencéError extends NotFoundError {
  constructor() {
    super(`Le projet n'est pas référencé`);
  }
}
