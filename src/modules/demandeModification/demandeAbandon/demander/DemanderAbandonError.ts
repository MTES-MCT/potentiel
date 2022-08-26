import { DomainError } from '@core/domain'

export class DemanderAbandonError extends DomainError {
  constructor(public raison: string) {
    super(`Votre demande n'a pas pu être prise en compte. ${raison}`)
  }
}
