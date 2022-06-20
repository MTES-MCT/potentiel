import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type DélaiAccordéPayload = {
  demandeDélaiId: string
  dateAchèvementDemandée: Date
  dateAchèvementAccordée: Date
  responseFileId?: string
} & (
  | { acceptedBy: { userId: string; role: 'dreal' | 'admin' | 'dgec' } }
  | { isLegacy: true }
  | {
      signaledBy: { userId: string; role: 'dreal' | 'dgec' | 'admin' }
      decidedOn: Date
      notes?: Date
    }
)

export class DélaiAccordé extends BaseDomainEvent<DélaiAccordéPayload> implements DomainEvent {
  public static type: 'DélaiAccordé' = 'DélaiAccordé'
  public type = DélaiAccordé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DélaiAccordéPayload) {
    return payload.demandeDélaiId
  }
}
