import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { AppelOffre, Periode, Project } from '../../../entities'
import { CandidateNotification } from '../../candidateNotification/CandidateNotification'

export interface ProjectCertificateGeneratedPayload {
  certificateFileId: Project['certificateFileId']
  projectId: Project['id']
  candidateEmail: Project['email']
  periodeId: Periode['id']
  appelOffreId: AppelOffre['id']
}
export class ProjectCertificateGenerated
  extends BaseDomainEvent<ProjectCertificateGeneratedPayload>
  implements DomainEvent {
  public static type: 'ProjectCertificateGenerated' = 'ProjectCertificateGenerated'

  public type = ProjectCertificateGenerated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectCertificateGeneratedPayload) {
    return [payload.projectId, CandidateNotification.makeId(payload)]
  }
}
