import { BaseDomainEvent, DomainEvent } from '@core/domain';

type Payload = {
  demandeId: string;
  annuléePar: string;
};

export class AnnulationAbandonAnnulée extends BaseDomainEvent<Payload> implements DomainEvent {
  public static type: 'AnnulationAbandonAnnulée' = 'AnnulationAbandonAnnulée';
  public type = AnnulationAbandonAnnulée.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: Payload) {
    return payload.demandeId;
  }
}
