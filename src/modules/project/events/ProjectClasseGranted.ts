import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectClasseGrantedPayload {
  projectId: string
  grantedBy: string
}
export class ProjectClasseGranted
  extends BaseDomainEvent<ProjectClasseGrantedPayload>
  implements DomainEvent {
  public static type: 'ProjectClasseGranted' = 'ProjectClasseGranted'
  public type = ProjectClasseGranted.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectClasseGrantedPayload) {
    return payload.projectId
  }
}
