import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type DélaiDemandéPayload = {
  demandeDélaiId: string
  projetId: string
  autorité: 'dgec' | 'dreal'
  fichierId?: string
  justification?: string
  dateAchèvementDemandée: Date
  porteurId: string
}

export class DélaiDemandé extends BaseDomainEvent<DélaiDemandéPayload> implements DomainEvent {
  public static type: 'DélaiDemandé' = 'DélaiDemandé'
  public type = DélaiDemandé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DélaiDemandéPayload) {
    return payload.demandeDélaiId
  }
}
