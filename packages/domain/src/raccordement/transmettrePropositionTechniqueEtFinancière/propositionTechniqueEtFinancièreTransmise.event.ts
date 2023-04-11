import { DomainEvent } from '@potentiel/core-domain';

export type PropositionTechniqueEtFinancièreTransmiseEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreTransmise',
  {
    dateSignature: string;
    référenceDemandeComplèteRaccordement: string;
    identifiantProjet: string;
  }
>;
