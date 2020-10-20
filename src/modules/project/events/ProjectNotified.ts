import { Project, Periode, AppelOffre, Famille } from '../../../entities'
import {
  DomainEvent,
  BaseDomainEvent,
  BaseDomainEventProps,
} from '../../../core/domain/DomainEvent'
import { CandidateNotification } from '../../candidateNotification/CandidateNotification'

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

  aggregateIdFromPayload(payload: ProjectNotifiedPayload) {
    return [payload.projectId, CandidateNotification.makeId(payload)]
  }
}
