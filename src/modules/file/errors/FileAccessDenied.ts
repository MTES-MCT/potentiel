import { DomainError } from '../../../core/domain/DomainError'

export class FileAccessDeniedError extends DomainError {
  constructor() {
    super("Vous n'avez pas le droit de consulter ce fichier.")
  }
}
