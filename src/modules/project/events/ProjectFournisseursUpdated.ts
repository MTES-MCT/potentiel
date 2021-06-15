import { Fournisseur } from '..'
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectFournisseursUpdatedPayload {
  projectId: string
  newFournisseurs: Fournisseur[]
  newEvaluationCarbone?: number
  updatedBy: string
}

export class ProjectFournisseursUpdated
  extends BaseDomainEvent<ProjectFournisseursUpdatedPayload>
  implements DomainEvent {
  public static type: 'ProjectFournisseursUpdated' = 'ProjectFournisseursUpdated'
  public type = ProjectFournisseursUpdated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectFournisseursUpdatedPayload) {
    return payload.projectId
  }
}
