import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectDCRDueDateSetPayload {
  projectId: string
  dcrDueOn: number
}
export class ProjectDCRDueDateSet
  extends BaseDomainEvent<ProjectDCRDueDateSetPayload>
  implements DomainEvent {
  public static type: 'ProjectDCRDueDateSet' = 'ProjectDCRDueDateSet'
  public type = ProjectDCRDueDateSet.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectDCRDueDateSetPayload) {
    return payload.projectId
  }
}
