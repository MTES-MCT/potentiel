import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type AbandonRejetéPayload = {
  demandeAbandonId: string
  fichierRéponseId?: string
  projetId: string
  rejetéPar: string
}

export class AbandonRejeté extends BaseDomainEvent<AbandonRejetéPayload> implements DomainEvent {
  public static type: 'AbandonRejeté' = 'AbandonRejeté'
  public type = AbandonRejeté.type
  currentVersion = 1

  aggregateIdFromPayload(payload: AbandonRejetéPayload) {
    return payload.demandeAbandonId
  }
}
