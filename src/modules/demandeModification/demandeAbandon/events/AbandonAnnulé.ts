import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type AbandonAnnuléPayload = {
  demandeAbandonId: string
  projetId: string
  annuléPar: string
}

export class AbandonAnnulé extends BaseDomainEvent<AbandonAnnuléPayload> implements DomainEvent {
  public static type: 'AbandonAnnulé' = 'AbandonAnnulé'
  public type = AbandonAnnulé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: AbandonAnnuléPayload) {
    return payload.demandeAbandonId
  }
}
