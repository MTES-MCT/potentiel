import { DomainError } from '../../../core/domain'

export class ProjectCannotBeUpdatedIfUnnotifiedError extends DomainError {
  constructor() {
    super("Le projet ne peut pas être mis à jour car il n'est pas encore notifié.")
  }
}
