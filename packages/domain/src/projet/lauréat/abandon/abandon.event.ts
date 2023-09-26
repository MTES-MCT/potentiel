import { DomainEvent } from '@potentiel/core-domain';

export type AbandonDemandéEvent = DomainEvent<
  'AbandonDemandé',
  {
    dateAbandon: string;
    identifiantProjet: string;
    raison: string;
    avecRecandidature: boolean;
    piéceJustificative: {
      format: string;
    };
  }
>;

export type AbandonEvent = AbandonDemandéEvent;
