import { DomainError } from '../../../core/domain';

export class ProjetDéjàClasséError extends DomainError {
  constructor() {
    super(`Le projet est déjà en statut "classé".`);
  }
}
