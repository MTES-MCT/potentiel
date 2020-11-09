import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { AppelOffre, Periode, Project } from '../../../entities'
import { makeCandidateNotificationId } from '../CandidateNotification'

export interface CandidateNotificationForPeriodeFailedPayload {
  candidateEmail: Project['email']
  periodeId: Periode['id']
  appelOffreId: AppelOffre['id']
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
