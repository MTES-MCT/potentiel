import { DomainError } from '@core/domain';

export class CDCProjetIncompatibleAvecAccordAnnulationAbandonError extends DomainError {
  constructor(public projetId: string) {
    super(
      `Vous ne pouvez pas accorder cette demande car le cahier des charges du projet ne prévoit pas d'annulation d'abandon.`,
    );
  }
}
