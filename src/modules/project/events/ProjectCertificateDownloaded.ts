import { Project, Periode, AppelOffre, User } from '../../../entities'
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectCertificateDownloadedPayload {
  certificateFileId: Project['certificateFileId']
  projectId: Project['id']
  downloadedBy: User['id']
}
export class ProjectCertificateDownloaded
  extends BaseDomainEvent<ProjectCertificateDownloadedPayload>
  implements DomainEvent {
  public static type: 'ProjectCertificateDownloaded' =
    'ProjectCertificateDownloaded'
  public type = ProjectCertificateDownloaded.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectCertificateDownloadedPayload) {
    return payload.projectId
  }
}
