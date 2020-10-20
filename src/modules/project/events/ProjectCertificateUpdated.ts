import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { Project } from '../../../entities'

export interface ProjectCertificateUpdatedPayload {
  projectId: Project['id']
  certificateFileId: Project['certificateFileId']
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
