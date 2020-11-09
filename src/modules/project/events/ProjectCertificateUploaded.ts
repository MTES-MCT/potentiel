import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectCertificateUpdatedPayload {
  projectId: string
  certificateFileId: string
  uploadedBy: string // userId
}
export class ProjectCertificateUploaded
  extends BaseDomainEvent<ProjectCertificateUpdatedPayload>
  implements DomainEvent {
  public static type: 'ProjectCertificateUpdated' = 'ProjectCertificateUpdated'
  public type = ProjectCertificateUploaded.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectCertificateUpdatedPayload) {
    return payload.projectId
  }
}
