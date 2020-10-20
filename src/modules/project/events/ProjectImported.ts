import { Project, Periode, AppelOffre, Famille, User } from '../../../entities'
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectImportedPayload {
  projectId: Project['id']
  periodeId: Periode['id']
  appelOffreId: AppelOffre['id']
  familleId: Famille['id']
  numeroCRE: Project['numeroCRE']
  data: any
  importedBy: User['id']
}
export class ProjectImported
  extends BaseDomainEvent<ProjectImportedPayload>
  implements DomainEvent {
  public static type: 'ProjectImported' = 'ProjectImported'
  public type = ProjectImported.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectImportedPayload) {
    return payload.projectId
  }
}
