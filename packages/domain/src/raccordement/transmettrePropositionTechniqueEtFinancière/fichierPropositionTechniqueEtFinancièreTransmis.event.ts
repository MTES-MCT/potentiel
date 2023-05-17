import { DomainEvent } from '@potentiel/core-domain';

export type FichierPropositionTechniqueEtFinancièreTransmisEvent = DomainEvent<
  'FichierPropositionTechniqueEtFinancièreTransmis',
  {
    identifiantProjet: string;
    format: string;
    référenceDossierRaccordement: string;
  }
>;
