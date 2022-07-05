import { DomainError } from '@core/domain'

export class DemanderDélaiDateAchèvementAntérieureError extends DomainError {
  constructor() {
    super(`Impossible de demander une nouvelle date d'achèvement car la date est antérieure à la date théorique d'achèvement`)
  }
}