import { Project, User } from '../../../entities'
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface CandidateInformedOfCertificateUpdatePayload {
  porteurProjetId: User['id']
  projectId: Project['id']
}
export class CandidateInformedOfCertificateUpdate
  extends BaseDomainEvent<CandidateInformedOfCertificateUpdatePayload>
  implements DomainEvent {
  public static type: 'CandidateInformedOfCertificateUpdate' =
    'CandidateInformedOfCertificateUpdate'

  public type = CandidateInformedOfCertificateUpdate.type
  currentVersion = 1

  aggregateIdFromPayload(payload: CandidateInformedOfCertificateUpdatePayload) {
    return [payload.projectId, payload.porteurProjetId]
  }
}
