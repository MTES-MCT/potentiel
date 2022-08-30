import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type RejetAbandonAnnuléPayload = {
  demandeAbandonId: string
  projetId: string
  annuléPar: string
}

export class RejetAbandonAnnulé
  extends BaseDomainEvent<RejetAbandonAnnuléPayload>
  implements DomainEvent
{
  public static type: 'RejetAbandonAnnulé' = 'RejetAbandonAnnulé'
  public type = RejetAbandonAnnulé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: RejetAbandonAnnuléPayload) {
    return payload.demandeAbandonId
  }
}
