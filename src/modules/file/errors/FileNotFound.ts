import { DomainError } from '@core/domain'

export class FileNotFoundError extends DomainError {
  constructor() {
    super('Le fichier demandé est introuvable.')
  }
}
