import { makeClaimProjectAggregateId } from '..'
import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectClaimedPayload {
  projectId: string
  claimedBy: string
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
