import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectPTFRemovedPayload {
  projectId: string
  removedBy: string
}
export class ProjectPTFRemoved
  extends BaseDomainEvent<ProjectPTFRemovedPayload>
  implements DomainEvent {
  public static type: 'ProjectPTFRemoved' = 'ProjectPTFRemoved'
  public type = ProjectPTFRemoved.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectPTFRemovedPayload) {
    return payload.projectId
  }
}
