import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { makeLegacyCandidateNotificationId } from '../LegacyCandidateNotification'

export interface LegacyCandidateNotifiedPayload {
  email: string
  importId: string
}
export class LegacyCandidateNotified
  extends BaseDomainEvent<LegacyCandidateNotifiedPayload>
  implements DomainEvent
{
  public static type: 'LegacyCandidateNotified' = 'LegacyCandidateNotified'

  public type = LegacyCandidateNotified.type
  currentVersion = 1

  aggregateIdFromPayload(payload: LegacyCandidateNotifiedPayload) {
    return makeLegacyCandidateNotificationId(payload)
  }
}
