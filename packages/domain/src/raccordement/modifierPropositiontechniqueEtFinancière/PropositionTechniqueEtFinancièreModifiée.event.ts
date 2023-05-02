import { DomainEvent } from '@potentiel/core-domain';

export type PropositionTechniqueEtFinancièreModifiéeEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreModifiée',
  {
    identifiantProjet: string;
    dateSignature: string;
    référence: string;
  }
>;
