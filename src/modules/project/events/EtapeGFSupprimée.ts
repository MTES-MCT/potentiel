import { BaseDomainEvent, DomainEvent } from '../../../core/domain';

// Suppression des GF quelque soit leur statut pour un projet non soumis à GF
// Evénement émis dans une migration pour corriger des projets

type EtapeGFSuppriméePayload = {
  projetId: string;
};
export class EtapeGFSupprimée
  extends BaseDomainEvent<EtapeGFSuppriméePayload>
  implements DomainEvent
{
  public static type: 'EtapeGFSupprimée' = 'EtapeGFSupprimée';
  public type = EtapeGFSupprimée.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: EtapeGFSuppriméePayload) {
    return payload.projetId;
  }
}
