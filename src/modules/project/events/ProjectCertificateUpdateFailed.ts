import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { AppelOffre, Periode, Project } from '../../../entities'
import { CandidateNotification } from '../../candidateNotification/CandidateNotification'

export interface ProjectCertificateUpdateFailedPayload {
  projectId: Project['id']
  error: string
}
export class ProjectCertificateUpdateFailed
  extends BaseDomainEvent<ProjectCertificateUpdateFailedPayload>
  implements DomainEvent {
  public static type: 'ProjectCertificateUpdateFailed' =
    'ProjectCertificateUpdateFailed'
  public type = ProjectCertificateUpdateFailed.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectCertificateUpdateFailedPayload) {
    return payload.projectId
  }
}
