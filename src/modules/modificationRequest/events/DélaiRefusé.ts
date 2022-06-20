import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type DélaiRefuséPayload = {
  demandeDélaiId: string
  dateAchèvementDemandée: Date
  responseFileId?: string
} & (
  | { rejectedBy: { userId: string; role: 'dreal' | 'admin' | 'dgec' } }
  | { isLegacy: true }
  | {
      signaledBy: { userId: string; role: 'dreal' | 'dgec' | 'admin' }
      decidedOn: Date
      notes?: Date
    }
)

export class DélaiRefusé extends BaseDomainEvent<DélaiRefuséPayload> implements DomainEvent {
  public static type: 'DélaiRefusé' = 'DélaiRefusé'
  public type = DélaiRefusé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DélaiRefuséPayload) {
    return payload.demandeDélaiId
  }
}
