import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface ProjectDCRDueDateCancelledPayload {
  projectId: string
}
export class ProjectDCRDueDateCancelled
  extends BaseDomainEvent<ProjectDCRDueDateCancelledPayload>
  implements DomainEvent
{
  public static type: 'ProjectDCRDueDateCancelled' = 'ProjectDCRDueDateCancelled'
  public type = ProjectDCRDueDateCancelled.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectDCRDueDateCancelledPayload) {
    return payload.projectId
  }
}
