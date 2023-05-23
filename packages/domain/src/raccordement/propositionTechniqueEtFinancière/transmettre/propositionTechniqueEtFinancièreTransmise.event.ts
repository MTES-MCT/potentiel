import { DomainEvent } from '@potentiel/core-domain';

export type PropositionTechniqueEtFinancièreTransmiseEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreTransmise',
  {
    dateSignature: string;
    référenceDossierRaccordement: string;
    identifiantProjet: string;
  }
>;
