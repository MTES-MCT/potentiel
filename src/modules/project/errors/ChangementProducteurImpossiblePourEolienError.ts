import { DomainError } from '@core/domain'

export class ChangementProducteurImpossiblePourEolienError extends DomainError {
  constructor() {
    super(`Vous ne pouvez pas changer de producteur avant l'achèvement du projet.`)
  }
}
