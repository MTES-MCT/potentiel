import { ReadModel } from '@potentiel/core-domain-views';
import { RawIdentifiantProjet } from '@potentiel/domain';

export type GarantiesFinancièresÀDéposerReadModelKey =
  `garanties-financières-à-déposer|${RawIdentifiantProjet}`;

export type GarantiesFinancièresÀDéposerReadModel = ReadModel<
  'garanties-financières-à-déposer',
  {
    identifiantProjet: RawIdentifiantProjet;
    dateLimiteDépôt?: string;
    région: string;
    statutDépôt: 'en attente' | 'en cours' | 'validé';
  }
>;
