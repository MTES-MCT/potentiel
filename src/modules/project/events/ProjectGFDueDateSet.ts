import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { Project } from '../../../entities'

export interface ProjectGFDueDateSetPayload {
  projectId: Project['id']
  garantiesFinancieresDueOn: Project['garantiesFinancieresDueOn']
}
export class ProjectGFDueDateSet
  extends BaseDomainEvent<ProjectGFDueDateSetPayload>
  implements DomainEvent {
  public static type: 'ProjectGFDueDateSet' = 'ProjectGFDueDateSet'
  public type = ProjectGFDueDateSet.type
  currentVersion = 1
}
