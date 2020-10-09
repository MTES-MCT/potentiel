import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectDCRSubmittedPayload {
  projectId: string
  dcrDate: Date
  fileId: string
  numeroDossier: string
  submittedBy: string
}
export class ProjectDCRSubmitted
  extends BaseDomainEvent<ProjectDCRSubmittedPayload>
  implements DomainEvent {
  public static type: 'ProjectDCRSubmitted' = 'ProjectDCRSubmitted'
  public type = ProjectDCRSubmitted.type
  currentVersion = 1
}
