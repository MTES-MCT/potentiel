import { Project, Periode, AppelOffre } from '../../../entities'
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

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
}
