import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { stableStringify } from '../../../core/utils'

export interface PeriodeNotifiedPayload {
  periodeId: string
  appelOffreId: string
  notifiedOn: number
  requestedBy: string
}
export class PeriodeNotified
  extends BaseDomainEvent<PeriodeNotifiedPayload>
  implements DomainEvent {
  public static type: 'PeriodeNotified' = 'PeriodeNotified'
  public type = PeriodeNotified.type
  currentVersion = 1

  aggregateIdFromPayload(payload: PeriodeNotifiedPayload) {
    const { periodeId, appelOffreId } = payload
    const key = { appelOffreId, periodeId }
    return stableStringify(key)
  }
}
