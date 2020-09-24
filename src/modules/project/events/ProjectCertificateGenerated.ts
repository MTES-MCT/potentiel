import { Project, Periode, AppelOffre } from '../../../entities'
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

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
  public static type: 'ProjectCertificateGenerated' =
    'ProjectCertificateGenerated'
  public type = ProjectCertificateGenerated.type
  currentVersion = 1
}
