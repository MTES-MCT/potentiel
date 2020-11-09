import { DomainError } from '../../../core/domain'

export class ProjectAlreadyNotifiedError extends DomainError {
  constructor() {
    super('Le projet est déjà notifié.')
  }
}
