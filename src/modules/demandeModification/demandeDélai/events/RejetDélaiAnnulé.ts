import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type RejetDélaiAnnuléPayload = {
  demandeDélaiId: string
  projetId: string
  annuléPar: string
}

export class RejetDélaiAnnulé
  extends BaseDomainEvent<RejetDélaiAnnuléPayload>
  implements DomainEvent
{
  public static type: 'RejetDélaiAnnulé' = 'RejetDélaiAnnulé'
  public type = RejetDélaiAnnulé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: RejetDélaiAnnuléPayload) {
    return payload.demandeDélaiId
  }
}
