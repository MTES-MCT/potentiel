import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectGFSubmittedPayload {
  projectId: string
  gfDate: Date
  fileId: string
  submittedBy: string
}
export class ProjectGFSubmitted
  extends BaseDomainEvent<ProjectGFSubmittedPayload>
  implements DomainEvent {
  public static type: 'ProjectGFSubmitted' = 'ProjectGFSubmitted'
  public type = ProjectGFSubmitted.type
  currentVersion = 1
}
