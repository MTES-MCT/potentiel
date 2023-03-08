import { ProjectEvent } from '../projectEvent.model';

export type DemandeAnnulationAbandonEventStatus = 'envoyée' | 'annulée' | 'rejetée' | 'accordée';

export type DemandeAnnulationAbandonEvent = ProjectEvent & {
  type: 'DemandeAnnulationAbandon';
  payload: {
    statut: DemandeAnnulationAbandonEventStatus;
  };
};
