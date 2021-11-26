import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { makeCandidateNotificationId } from '../helpers'

export interface CandidateNotifiedForPeriodePayload {
  candidateEmail: string
  candidateName: string
  periodeId: string
  appelOffreId: string
}
export class CandidateNotifiedForPeriode
  extends BaseDomainEvent<CandidateNotifiedForPeriodePayload>
  implements DomainEvent {
  public static type: 'CandidateNotifiedForPeriode' = 'CandidateNotifiedForPeriode'

  public type = CandidateNotifiedForPeriode.type
  currentVersion = 1

  aggregateIdFromPayload(payload: CandidateNotifiedForPeriodePayload) {
    return makeCandidateNotificationId(payload)
  }
}
