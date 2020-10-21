import { Project, Periode, AppelOffre, Famille, User } from '../../../entities'
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectReimportedPayload {
  projectId: Project['id']
  notifiedOn: Project['notifiedOn']
  importedBy: User['id']
  data: Project
}
export class ProjectReimported
  extends BaseDomainEvent<ProjectReimportedPayload>
  implements DomainEvent {
  public static type: 'ProjectReimported' = 'ProjectReimported'
  public type = ProjectReimported.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectReimportedPayload) {
    return payload.projectId
  }
}
