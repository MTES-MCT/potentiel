import { makeClaimProjectAggregateId } from '../helpers'
import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface ProjectClaimedPayload {
  projectId: string
  claimedBy: string
  claimerEmail: string
  attestationDesignationFileId: string
}
export class ProjectClaimed extends BaseDomainEvent<ProjectClaimedPayload> implements DomainEvent {
  public static type: 'ProjectClaimed' = 'ProjectClaimed'
  public type = ProjectClaimed.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectClaimedPayload) {
    const { projectId, claimedBy } = payload
    return makeClaimProjectAggregateId({ projectId, claimedBy })
  }
}
