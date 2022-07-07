import format from 'date-fns/format'
import { DomainError } from '@core/domain'

export class AccorderDateAchèvementAntérieureDateThéoriqueError extends DomainError {
  constructor(public nouvelleDateAchèvement: Date, public dateThéorique: Date) {
    super(
      `Impossible d'accorder la nouvelle date d'achèvement (${format(
        nouvelleDateAchèvement,
        'dd/mm/yyyy'
      )}) car la date est antérieure à la date théorique d'achèvement (${format(
        dateThéorique,
        'dd/mm/yyyy'
      )})`
    )
  }
}
