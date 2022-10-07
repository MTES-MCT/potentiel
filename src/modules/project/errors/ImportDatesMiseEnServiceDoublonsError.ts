import { DomainError } from '@core/domain'

export class ImportDatesMiseEnServiceDoublonsError extends DomainError {
  constructor(numéroDeGestionnaire: string) {
    super(`Le numéro de gestionnaire ${numéroDeGestionnaire} est en doublon dans le fichier.`)
  }
}
