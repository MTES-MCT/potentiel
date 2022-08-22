import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type RejetRecoursAnnuléPayload = {
  demandeRecoursId: string
  projetId: string
  annuléPar: string
}

export class RejetRecoursAnnulé
  extends BaseDomainEvent<RejetRecoursAnnuléPayload>
  implements DomainEvent
{
  public static type: 'RejetRecoursAnnulé' = 'RejetRecoursAnnulé'
  public type = RejetRecoursAnnulé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: RejetRecoursAnnuléPayload) {
    return payload.demandeRecoursId
  }
}
