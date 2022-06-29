import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type DélaiRefuséPayload = {
  demandeDélaiId: string
  fichierRéponseId: string
  refuséPar: string
}

export class DélaiRefusé extends BaseDomainEvent<DélaiRefuséPayload> implements DomainEvent {
  public static type: 'DélaiRefusé' = 'DélaiRefusé'
  public type = DélaiRefusé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DélaiRefuséPayload) {
    return payload.demandeDélaiId
  }
}
