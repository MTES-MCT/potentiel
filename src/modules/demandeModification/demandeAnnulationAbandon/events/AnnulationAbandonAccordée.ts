import { BaseDomainEvent, DomainEvent } from '@core/domain'

type Payload = {
  demandeId: string
  projetId: string
  accordéPar: string
  fichierRéponseId: string
}

export class AnnulationAbandonAccordée extends BaseDomainEvent<Payload> implements DomainEvent {
  public static type: 'AnnulationAbandonAccordée' = 'AnnulationAbandonAccordée'
  public type = AnnulationAbandonAccordée.type
  currentVersion = 1

  aggregateIdFromPayload(payload: Payload) {
    return payload.demandeId
  }
}
