import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface CandidateInformedOfCertificateUpdatePayload {
  porteurProjetId: string
  projectId: string
}
export class CandidateInformedOfCertificateUpdate
  extends BaseDomainEvent<CandidateInformedOfCertificateUpdatePayload>
  implements DomainEvent
{
  public static type: 'CandidateInformedOfCertificateUpdate' =
    'CandidateInformedOfCertificateUpdate'

  public type = CandidateInformedOfCertificateUpdate.type
  currentVersion = 1

  aggregateIdFromPayload(payload: CandidateInformedOfCertificateUpdatePayload) {
    return [payload.projectId, payload.porteurProjetId]
  }
}
