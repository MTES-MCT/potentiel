import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { makeCandidateNotificationId } from '../../candidateNotification/helpers'

export interface ProjectCertificateGenerationFailedPayload {
  projectId: string
  candidateEmail: string
  periodeId: string
  appelOffreId: string
  error: string
}
export class ProjectCertificateGenerationFailed
  extends BaseDomainEvent<ProjectCertificateGenerationFailedPayload>
  implements DomainEvent {
  public static type: 'ProjectCertificateGenerationFailed' = 'ProjectCertificateGenerationFailed'

  public type = ProjectCertificateGenerationFailed.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectCertificateGenerationFailedPayload) {
    return [payload.projectId, makeCandidateNotificationId(payload)]
  }
}
