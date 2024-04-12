import { DomainError } from '../../../../core/domain';

export class DateAntérieureDateAchèvementInitialeError extends DomainError {
  constructor() {
    super(
      `La nouvelle date d'achèvement ne peut pas être antérieure à la date d'achèvement initiale du projet.`,
    );
  }
}
