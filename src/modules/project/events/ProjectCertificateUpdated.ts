import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface ProjectCertificateUpdatedPayload {
  projectId: string
  certificateFileId: string
  uploadedBy: string // userId
}
export class ProjectCertificateUpdated
  extends BaseDomainEvent<ProjectCertificateUpdatedPayload>
  implements DomainEvent {
  public static type: 'ProjectCertificateUpdated' = 'ProjectCertificateUpdated'
  public type = ProjectCertificateUpdated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectCertificateUpdatedPayload) {
    return payload.projectId
  }
}
