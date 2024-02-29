import { DomainError } from '../../../../core/domain';

export class NouvellePuissanceAuDessusPuissanceMaxVolumeReserveError extends DomainError {
  constructor() {
    super(`La nouvelle puissance ne peut pas dépasser la puissance maximale du volume réservé.`);
  }
}
