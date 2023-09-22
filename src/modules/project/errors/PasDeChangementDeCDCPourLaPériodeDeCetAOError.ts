import { DomainError } from '../../../core/domain';

export class PasDeCDCModifiéDisponiblePourLaPériodeError extends DomainError {
  constructor() {
    super(
      `Vous ne pouvez pas changer de cahier des charges pour cette période d'appel d'offres.`,
    );
  }
}
