import { makeClaimProjectAggregateId } from '..'
import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectClaimedByOwnerPayload {
  projectId: string
  claimedBy: string
  claimerEmail: string
}
export class ProjectClaimedByOwner
  extends BaseDomainEvent<ProjectClaimedByOwnerPayload>
  implements DomainEvent {
  public static type: 'ProjectClaimedByOwner' = 'ProjectClaimedByOwner'
  public type = ProjectClaimedByOwner.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectClaimedByOwnerPayload) {
    const { projectId, claimedBy } = payload
    return makeClaimProjectAggregateId({ projectId, claimedBy })
  }
}
