import { BaseDomainEvent, DomainEvent } from '@core/domain';

export type AnnulationAbandonRejetéePayload = {
  demandeId: string;
  fichierRéponseId: string;
  projetId: string;
  rejetéPar: string;
};

export class AnnulationAbandonRejetée
  extends BaseDomainEvent<AnnulationAbandonRejetéePayload>
  implements DomainEvent
{
  public static type: 'AnnulationAbandonRejetée' = 'AnnulationAbandonRejetée';
  public type = AnnulationAbandonRejetée.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: AnnulationAbandonRejetéePayload) {
    return payload.demandeId;
  }
}
