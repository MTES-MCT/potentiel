import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface ProjectCompletionDueDateCancelledPayload {
  projectId: string
}
export class ProjectCompletionDueDateCancelled
  extends BaseDomainEvent<ProjectCompletionDueDateCancelledPayload>
  implements DomainEvent
{
  public static type: 'ProjectCompletionDueDateCancelled' = 'ProjectCompletionDueDateCancelled'
  public type = ProjectCompletionDueDateCancelled.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectCompletionDueDateCancelledPayload) {
    return payload.projectId
  }
}
