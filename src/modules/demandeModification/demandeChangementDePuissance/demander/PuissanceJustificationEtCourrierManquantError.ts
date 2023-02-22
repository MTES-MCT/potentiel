import { DomainError } from '@core/domain';

export class PuissanceJustificationEtCourrierManquantError extends DomainError {
  constructor() {
    super(
      'Vous devez joindre un courrier ou indiquer un motif dans votre demande de changement de puissance.',
    );
  }
}
