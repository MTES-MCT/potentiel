import { DomainError } from '@core/domain'

export class AccorderDateAchèvementAntérieureDateThéoriqueError extends DomainError {
  constructor() {
    super(
      `Impossible d'accorder la nouvelle date d'achèvement car la date est antérieure à la date théorique d'achèvement`
    )
  }
}
