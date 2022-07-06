import { DomainError } from '@core/domain'

export class DemanderDateAchèvementAntérieureDateThéoriqueError extends DomainError {
  constructor() {
    super(
      `Impossible de demander la nouvelle date d'achèvement car la date est antérieure à la date théorique d'achèvement`
    )
  }
}
