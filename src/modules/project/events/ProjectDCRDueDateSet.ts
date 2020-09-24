import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { Project } from '../../../entities'

export interface ProjectDCRDueDateSetPayload {
  projectId: Project['id']
  dcrDueOn: Project['dcrDueOn']
}
export class ProjectDCRDueDateSet
  extends BaseDomainEvent<ProjectDCRDueDateSetPayload>
  implements DomainEvent {
  public static type: 'ProjectDCRDueDateSet' = 'ProjectDCRDueDateSet'
  public type = ProjectDCRDueDateSet.type
  currentVersion = 1
}
