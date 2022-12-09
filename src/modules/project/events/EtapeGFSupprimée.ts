import { BaseDomainEvent, DomainEvent } from '@core/domain'

// Suppression des GF quelque soient leur statut pour un projet non soumis à GF
// Evénement émis dans une migration pour corriger des projets

export interface EtapeGFSuppriméePayload {
  projetId: string
}
export class EtapeGFSupprimée
  extends BaseDomainEvent<EtapeGFSuppriméePayload>
  implements DomainEvent
{
  public static type: 'EtapeGFSupprimée' = 'EtapeGFSupprimée'
  public type = EtapeGFSupprimée.type
  currentVersion = 1

  aggregateIdFromPayload(payload: EtapeGFSuppriméePayload) {
    return payload.projetId
  }
}
