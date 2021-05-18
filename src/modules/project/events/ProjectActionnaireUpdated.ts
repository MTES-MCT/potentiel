import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectActionnaireUpdatedPayload {
  projectId: string
  newActionnaire: string
  updatedBy: string
}

export class ProjectActionnaireUpdated
  extends BaseDomainEvent<ProjectActionnaireUpdatedPayload>
  implements DomainEvent {
  public static type: 'ProjectActionnaireUpdated' = 'ProjectActionnaireUpdated'
  public type = ProjectActionnaireUpdated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectActionnaireUpdatedPayload) {
    return payload.projectId
  }
}
