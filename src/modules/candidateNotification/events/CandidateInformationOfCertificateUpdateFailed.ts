import { Project, User } from '../../../entities'
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface CandidateInformationOfCertificateUpdateFailedPayload {
  porteurProjetId: User['id']
  projectId: Project['id']
  error: string
}
export class CandidateInformationOfCertificateUpdateFailed
  extends BaseDomainEvent<CandidateInformationOfCertificateUpdateFailedPayload>
  implements DomainEvent {
  public static type: 'CandidateInformationOfCertificateUpdateFailed' =
    'CandidateInformationOfCertificateUpdateFailed'

  public type = CandidateInformationOfCertificateUpdateFailed.type
  currentVersion = 1

  aggregateIdFromPayload(payload: CandidateInformationOfCertificateUpdateFailedPayload) {
    return [payload.projectId, payload.porteurProjetId]
  }
}
