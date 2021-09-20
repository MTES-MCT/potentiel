import { DomainError } from '../../../core/domain'

export class ProjectHasAlreadyBeenClaimed extends DomainError {
  constructor() {
    super('Le projet a déjà été réclamé par son propriétaire.')
  }
}
