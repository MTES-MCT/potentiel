import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type DélaiAnnuléPayload = {
  demandeDélaiId: string
  projetId: string
  annuléPar: string
}

export class DélaiAnnulé extends BaseDomainEvent<DélaiAnnuléPayload> implements DomainEvent {
  public static type: 'DélaiAnnulé' = 'DélaiAnnulé'
  public type = DélaiAnnulé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DélaiAnnuléPayload) {
    return payload.demandeDélaiId
  }
}
