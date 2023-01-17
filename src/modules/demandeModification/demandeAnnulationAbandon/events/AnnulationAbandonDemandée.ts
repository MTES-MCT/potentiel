import { BaseDomainEvent, DomainEvent } from '@core/domain'

type Payload = {
  demandeId: string
  projetId: string
  demandéPar: string
}

export class AnnulationAbandonDemandée extends BaseDomainEvent<Payload> implements DomainEvent {
  public static type: 'AnnulationAbandonDemandée' = 'AnnulationAbandonDemandée'
  public type = AnnulationAbandonDemandée.type
  currentVersion = 1

  aggregateIdFromPayload(payload: Payload) {
    return payload.demandeId
  }
}
