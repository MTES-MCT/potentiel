import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface ProjectGFDueDateSetPayload {
  projectId: string
  garantiesFinancieresDueOn: number
}
export class ProjectGFDueDateSet
  extends BaseDomainEvent<ProjectGFDueDateSetPayload>
  implements DomainEvent
{
  public static type: 'ProjectGFDueDateSet' = 'ProjectGFDueDateSet'
  public type = ProjectGFDueDateSet.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectGFDueDateSetPayload) {
    return payload.projectId
  }
}
