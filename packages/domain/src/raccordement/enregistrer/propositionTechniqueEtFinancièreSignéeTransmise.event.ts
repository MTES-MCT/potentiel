import { DomainEvent } from '@potentiel/core-domain';

export type PropositionTechniqueEtFinancièreSignéeTransmiseEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreSignéeTransmise',
  {
    identifiantProjet: string;
    format: string;
    référenceDossierRaccordement: string;
  }
>;
