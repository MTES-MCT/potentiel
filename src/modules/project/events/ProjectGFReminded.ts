import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectGFRemindedPayload {
  projectId: string
}
export class ProjectGFReminded
  extends BaseDomainEvent<ProjectGFRemindedPayload>
  implements DomainEvent {
  public static type: 'ProjectGFReminded' = 'ProjectGFReminded'
  public type = ProjectGFReminded.type
  currentVersion = 1
}
