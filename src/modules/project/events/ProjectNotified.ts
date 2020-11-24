import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'
import { makeCandidateNotificationId } from '../../candidateNotification/CandidateNotification'

export interface ProjectNotifiedPayload {
  projectId: string
  candidateEmail: string
  candidateName: string
  periodeId: string
  appelOffreId: string
  familleId?: string
  notifiedOn: number
}
export class ProjectNotified
  extends BaseDomainEvent<ProjectNotifiedPayload>
  implements DomainEvent {
  public static type: 'ProjectNotified' = 'ProjectNotified'
  public type = ProjectNotified.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectNotifiedPayload) {
    return [payload.projectId, makeCandidateNotificationId(payload)]
  }
}
