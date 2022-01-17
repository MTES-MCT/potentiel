import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { makeLegacyCandidateNotificationId } from '../helpers'

export interface LegacyCandidateNotifiedPayload {
  email: string
  importId: string
}
export class LegacyCandidateNotified
  extends BaseDomainEvent<LegacyCandidateNotifiedPayload>
  implements DomainEvent {
  public static type: 'LegacyCandidateNotified' = 'LegacyCandidateNotified'

  public type = LegacyCandidateNotified.type
  currentVersion = 1

  aggregateIdFromPayload(payload: LegacyCandidateNotifiedPayload) {
    return makeLegacyCandidateNotificationId(payload)
  }
}
