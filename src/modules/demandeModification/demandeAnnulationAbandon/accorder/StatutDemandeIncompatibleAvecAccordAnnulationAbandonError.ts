import { DomainError } from '../../../../core/domain';

export class StatutDemandeIncompatibleAvecAccordAnnulationAbandonError extends DomainError {
  constructor(public statut: string) {
    super(`Cette demande ne peut pas être accordée car elle a le statut "${statut}"`);
  }
}
