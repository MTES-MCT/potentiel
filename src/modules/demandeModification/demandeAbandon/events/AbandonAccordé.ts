import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type AbandonAccordéPayload = {
  demandeAbandonId: string
  projetId: string
  fichierRéponseId?: string
  accordéPar: string
}

export class AbandonAccordé extends BaseDomainEvent<AbandonAccordéPayload> implements DomainEvent {
  public static type: 'AbandonAccordé' = 'AbandonAccordé'
  public type = AbandonAccordé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: AbandonAccordéPayload) {
    return payload.demandeAbandonId
  }
}
