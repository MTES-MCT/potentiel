import { DomainError } from '@core/domain'

export class DateAchèvementAntérieureDateThéoriqueError extends DomainError {
  constructor() {
    super(
      `Impossible d'accepter la nouvelle date d'achèvement car la date est antérieure à la date théorique d'achèvement`
    )
  }
}
