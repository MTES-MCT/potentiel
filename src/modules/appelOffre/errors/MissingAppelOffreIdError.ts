import { DomainError } from '../../../core/domain'

export class MissingAppelOffreIdError extends DomainError {
  constructor(public lineNumber: number) {
    super(`L‘appel offre est manquant à la ligne ${lineNumber}`)
  }
}
