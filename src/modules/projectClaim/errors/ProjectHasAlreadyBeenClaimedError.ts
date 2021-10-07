import { DomainError } from '../../../core/domain'

export class ProjectHasAlreadyBeenClaimedError extends DomainError {
  constructor(projectName: string) {
    super(`[${projectName}] Le projet a déjà été réclamé par son propriétaire.`)
  }
}
