import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type DélaiAccordéPayload = {
  demandeDélaiId: string
  dateAchèvementDemandée: Date
  dateAchèvementAccordée: Date
  fichierRéponseId?: string
  accordéPar: string
}

export class DélaiAccordé extends BaseDomainEvent<DélaiAccordéPayload> implements DomainEvent {
  public static type: 'DélaiAccordé' = 'DélaiAccordé'
  public type = DélaiAccordé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DélaiAccordéPayload) {
    return payload.demandeDélaiId
  }
}
