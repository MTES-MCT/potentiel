import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type AbandonDemandéPayload = {
  demandeAbandonId: string
  projetId: string
  autorité: 'dgec'
  fichierId?: string
  justification?: string
  porteurId: string
}

export class AbandonDemandé extends BaseDomainEvent<AbandonDemandéPayload> implements DomainEvent {
  public static type: 'AbandonDemandé' = 'AbandonDemandé'
  public type = AbandonDemandé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: AbandonDemandéPayload) {
    return payload.demandeAbandonId
  }
}
