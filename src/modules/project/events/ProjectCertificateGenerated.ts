import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'
import { makeCandidateNotificationId } from '../../notificationCandidats/helpers'

export interface ProjectCertificateGeneratedPayload {
  certificateFileId: string
  projectVersionDate: Date
  projectId: string
  candidateEmail: string
  periodeId: string
  appelOffreId: string
}
export class ProjectCertificateGenerated
  extends BaseDomainEvent<ProjectCertificateGeneratedPayload>
  implements DomainEvent
{
  public static type: 'ProjectCertificateGenerated' = 'ProjectCertificateGenerated'

  public type = ProjectCertificateGenerated.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<ProjectCertificateGeneratedPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: ProjectCertificateGeneratedPayload) {
    return [payload.projectId, makeCandidateNotificationId(payload)]
  }
}
