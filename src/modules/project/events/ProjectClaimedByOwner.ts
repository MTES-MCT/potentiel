import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectClaimedByOwnerPayload {
  projectId: string
  claimedBy: string
}
export class ProjectClaimedByOwner
  extends BaseDomainEvent<ProjectClaimedByOwnerPayload>
  implements DomainEvent {
  public static type: 'ProjectClaimedByOwner' = 'ProjectClaimedByOwner'
  public type = ProjectClaimedByOwner.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectClaimedByOwnerPayload) {
    return payload.projectId
  }
}
