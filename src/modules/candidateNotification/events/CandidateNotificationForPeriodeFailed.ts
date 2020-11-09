import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { makeCandidateNotificationId } from '../CandidateNotification'

export interface CandidateNotificationForPeriodeFailedPayload {
  candidateEmail: string
  periodeId: string
  appelOffreId: string
  error: string
}
export class CandidateNotificationForPeriodeFailed
  extends BaseDomainEvent<CandidateNotificationForPeriodeFailedPayload>
  implements DomainEvent {
  public static type: 'CandidateNotificationForPeriodeFailed' =
    'CandidateNotificationForPeriodeFailed'

  public type = CandidateNotificationForPeriodeFailed.type
  currentVersion = 1

  aggregateIdFromPayload(payload: CandidateNotificationForPeriodeFailedPayload) {
    return makeCandidateNotificationId(payload)
  }
}
