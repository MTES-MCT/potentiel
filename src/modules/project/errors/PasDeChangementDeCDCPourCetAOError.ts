import { DomainError } from '../../../core/domain';

export class PasDeChangementDeCDCPourCetAOError extends DomainError {
  constructor() {
    super(`Vous ne pouvez pas changer de cahier des charges pour cet appel d'offres.`);
  }
}
