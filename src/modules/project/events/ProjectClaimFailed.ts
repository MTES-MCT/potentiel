import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectClaimFailedPayload {
  projectId: string
  claimedBy: string
}
export class ProjectClaimFailed
  extends BaseDomainEvent<ProjectClaimFailedPayload>
  implements DomainEvent {
  public static type: 'ProjectClaimFailed' = 'ProjectClaimFailed'
  public type = ProjectClaimFailed.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectClaimFailedPayload) {
    return payload.projectId
  }
}
