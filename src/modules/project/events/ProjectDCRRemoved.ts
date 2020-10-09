import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectDCRRemovedPayload {
  projectId: string
  removedBy: string
}
export class ProjectDCRRemoved
  extends BaseDomainEvent<ProjectDCRRemovedPayload>
  implements DomainEvent {
  public static type: 'ProjectDCRRemoved' = 'ProjectDCRRemoved'
  public type = ProjectDCRRemoved.type
  currentVersion = 1
}
