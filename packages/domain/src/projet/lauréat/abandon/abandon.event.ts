import { DomainEvent } from '@potentiel/core-domain';

export type AbandonDemandéEvent = DomainEvent<
  'AbandonDemandé',
  {
    identifiantProjet: string;
    raison: string;
    avecRecandidature: boolean;
    piéceJustificative: {
      format: string;
    };
  }
>;

export type AbandonEvent = AbandonDemandéEvent;
