import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { Project } from '../../../entities'

export interface ProjectCertificateUpdateFailedPayload {
  projectId: Project['id']
  error: string
}
export class ProjectCertificateUpdateFailed
  extends BaseDomainEvent<ProjectCertificateUpdateFailedPayload>
  implements DomainEvent {
  public static type: 'ProjectCertificateUpdateFailed' = 'ProjectCertificateUpdateFailed'

  public type = ProjectCertificateUpdateFailed.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectCertificateUpdateFailedPayload) {
    return payload.projectId
  }
}
