import { DomainError } from '@core/domain';

export class SuppressionGFATraiterImpossibleError extends DomainError {
  constructor() {
    super(
      `Vous ne pouvez pas retirer ces garanties financières en attente de traitement par l'autorité compétente.`,
    );
  }
}
