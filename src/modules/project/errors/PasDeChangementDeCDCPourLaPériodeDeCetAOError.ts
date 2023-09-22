import { DomainError } from '../../../core/domain';

export class PasDeChangementDeCDCPourLaPériodeDeCetAOError extends DomainError {
  constructor() {
    super(
      `Vous ne pouvez pas changer de cahier des charges pour cette période d'appel d'offres.`,
    );
  }
}
