import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface CandidateInformationOfCertificateUpdateFailedPayload {
  porteurProjetId: string
  projectId: string
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
