import { BaseDomainEvent, DomainEvent } from '../../../../core/domain';
import { CahierDesChargesRéférence } from '@potentiel-domain/appel-offre';

export type AbandonDemandéPayload = {
  demandeAbandonId: string;
  projetId: string;
  autorité: 'dgec';
  fichierId?: string;
  justification?: string;
  porteurId: string;
  cahierDesCharges?: CahierDesChargesRéférence;
};

export class AbandonDemandé extends BaseDomainEvent<AbandonDemandéPayload> implements DomainEvent {
  public static type: 'AbandonDemandé' = 'AbandonDemandé';
  public type = AbandonDemandé.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: AbandonDemandéPayload) {
    return payload.demandeAbandonId;
  }
}
