import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectCompletionDueDateSetPayload {
  projectId: string
  completionDueOn: number
  setBy?: string
}
export class ProjectCompletionDueDateSet
  extends BaseDomainEvent<ProjectCompletionDueDateSetPayload>
  implements DomainEvent {
  public static type: 'ProjectCompletionDueDateSet' = 'ProjectCompletionDueDateSet'
  public type = ProjectCompletionDueDateSet.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectCompletionDueDateSetPayload) {
    return payload.projectId
  }
}
