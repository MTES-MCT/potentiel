import { DomainError } from '../../../core/domain';

export class DateEchéanceIncompatibleAvecLeTypeDeGFError extends DomainError {
  constructor() {
    super(
      "Vous ne pouvez pas renseigner une date d'échéance si le type de garanties financières n'est pas 'Garantie financière avec date d'échéance et à renouveler'",
    );
  }
}
