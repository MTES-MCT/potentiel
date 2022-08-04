import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type RejetDemandeDélaiAnnuléPayload = {
  demandeDélaiId: string
  projetId: string
  annuléPar: string
}

export class RejetDemandeDélaiAnnulé
  extends BaseDomainEvent<RejetDemandeDélaiAnnuléPayload>
  implements DomainEvent
{
  public static type: 'RejetDemandeDélaiAnnulé' = 'RejetDemandeDélaiAnnulé'
  public type = RejetDemandeDélaiAnnulé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: RejetDemandeDélaiAnnuléPayload) {
    return payload.demandeDélaiId
  }
}
