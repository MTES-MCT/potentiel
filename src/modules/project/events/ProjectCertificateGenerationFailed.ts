import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { AppelOffre, Periode, Project } from '../../../entities'
import { CandidateNotification } from '../../candidateNotification/CandidateNotification'

export interface ProjectCertificateGenerationFailedPayload {
  projectId: Project['id']
  candidateEmail: Project['email']
  periodeId: Periode['id']
  appelOffreId: AppelOffre['id']
  error: string
}
export class ProjectCertificateGenerationFailed
  extends BaseDomainEvent<ProjectCertificateGenerationFailedPayload>
  implements DomainEvent {
  public static type: 'ProjectCertificateGenerationFailed' =
    'ProjectCertificateGenerationFailed'
  public type = ProjectCertificateGenerationFailed.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectCertificateGenerationFailedPayload) {
    return [payload.projectId, CandidateNotification.makeId(payload)]
  }
}
