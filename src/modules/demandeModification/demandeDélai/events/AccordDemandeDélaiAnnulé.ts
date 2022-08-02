import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type AccordDemandeDélaiAnnuléPayload = {
  demandeDélaiId: string
  projetId: string
  annuléPar: string
}

export class AccordDemandeDélaiAnnulé
  extends BaseDomainEvent<AccordDemandeDélaiAnnuléPayload>
  implements DomainEvent
{
  public static type: 'AccordDemandeDélaiAnnulé' = 'AccordDemandeDélaiAnnulé'
  public type = AccordDemandeDélaiAnnulé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: AccordDemandeDélaiAnnuléPayload) {
    return payload.demandeDélaiId
  }
}
