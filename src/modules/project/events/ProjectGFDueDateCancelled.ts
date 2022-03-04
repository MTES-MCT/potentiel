import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface ProjectGFDueDateCancelledPayload {
  projectId: string
}
export class ProjectGFDueDateCancelled
  extends BaseDomainEvent<ProjectGFDueDateCancelledPayload>
  implements DomainEvent
{
  public static type: 'ProjectGFDueDateCancelled' = 'ProjectGFDueDateCancelled'
  public type = ProjectGFDueDateCancelled.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectGFDueDateCancelledPayload) {
    return payload.projectId
  }
}
