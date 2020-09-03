import { DomainError } from '../../../core/domain/DomainError'

export class FileNotFoundError extends DomainError {
  constructor() {
    super('Le fichier demandé est introuvable.')
  }
}
