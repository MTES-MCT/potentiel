import { Project, Periode, AppelOffre, Famille } from '../../../entities'
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectNotifiedPayload {
  projectId: Project['id']
  candidateEmail: Project['email']
  periodeId: Periode['id']
  appelOffreId: AppelOffre['id']
  familleId: Famille['id']
  notifiedOn: Project['notifiedOn']
}
export class ProjectNotified
  extends BaseDomainEvent<ProjectNotifiedPayload>
  implements DomainEvent {
  public static type: 'ProjectNotified' = 'ProjectNotified'
  public type = ProjectNotified.type
  currentVersion = 1
}
