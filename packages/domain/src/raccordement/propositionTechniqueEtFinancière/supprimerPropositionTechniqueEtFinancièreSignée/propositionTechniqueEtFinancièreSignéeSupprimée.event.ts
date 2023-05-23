import { DomainEvent } from '@potentiel/core-domain';

export type PropositionTechniqueEtFinancièreSignéeSuppriméeEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreSignéeSupprimée',
  {
    identifiantProjet: string;
    format: string;
    référenceDossierRaccordement: string;
  }
>;
