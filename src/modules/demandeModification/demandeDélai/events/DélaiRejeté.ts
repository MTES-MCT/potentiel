import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type DélaiRejetéPayload = {
  demandeDélaiId: string
  fichierRéponseId: string
  rejetéPar: string
}

export class DélaiRejeté extends BaseDomainEvent<DélaiRejetéPayload> implements DomainEvent {
  public static type: 'DélaiRejeté' = 'DélaiRejeté'
  public type = DélaiRejeté.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DélaiRejetéPayload) {
    return payload.demandeDélaiId
  }
}
