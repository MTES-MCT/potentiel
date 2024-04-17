import { DomainError } from '../../../../core/domain';

export class NouvellePuissanceAuDessusPuissanceFamilleError extends DomainError {
  constructor() {
    super(`La nouvelle puissance ne peut pas dépasser la puissance maximale de la famille`);
  }
}
