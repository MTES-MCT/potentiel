import { DomainEvent } from '@potentiel/core-domain';

export type AbandonDemandéEvent = DomainEvent<
  'AbandonDemandé',
  {
    dateAbandon: string;
    identifiantProjet: string;
    raison: string;
    recandidature: boolean;
    piéceJustificative: {
      format: string;
    };
  }
>;

export type AbandonEvent = AbandonDemandéEvent;
