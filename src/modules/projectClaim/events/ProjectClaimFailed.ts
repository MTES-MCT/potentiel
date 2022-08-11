import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { makeClaimProjectAggregateId } from '../helpers'

export interface ProjectClaimFailedPayload {
  projectId: string
  claimedBy: string
}

export class ProjectClaimFailed
  extends BaseDomainEvent<ProjectClaimFailedPayload>
  implements DomainEvent
{
  public static type: 'ProjectClaimFailed' = 'ProjectClaimFailed'
  public type = ProjectClaimFailed.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectClaimFailedPayload) {
    const { projectId, claimedBy } = payload
    return makeClaimProjectAggregateId({ projectId, claimedBy })
  }
}
