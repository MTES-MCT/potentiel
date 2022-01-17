import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface ProjectCertificateDownloadedPayload {
  certificateFileId: string
  projectId: string
  downloadedBy: string
}
export class ProjectCertificateDownloaded
  extends BaseDomainEvent<ProjectCertificateDownloadedPayload>
  implements DomainEvent {
  public static type: 'ProjectCertificateDownloaded' = 'ProjectCertificateDownloaded'

  public type = ProjectCertificateDownloaded.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectCertificateDownloadedPayload) {
    return payload.projectId
  }
}
