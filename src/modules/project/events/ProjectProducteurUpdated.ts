import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectProducteurUpdatedPayload {
  projectId: string
  newProducteur: string
  updatedBy: string
}

export class ProjectProducteurUpdated
  extends BaseDomainEvent<ProjectProducteurUpdatedPayload>
  implements DomainEvent {
  public static type: 'ProjectProducteurUpdated' = 'ProjectProducteurUpdated'
  public type = ProjectProducteurUpdated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectProducteurUpdatedPayload) {
    return payload.projectId
  }
}
