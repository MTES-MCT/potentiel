import { ReadModel } from '@potentiel/core-domain-views';
import { RawIdentifiantProjet } from '@potentiel/domain';

export type SuiviDépôtGarantiesFinancièresReadModelKey =
  `suivi-dépôt-garanties-financières|${RawIdentifiantProjet}`;

export type SuiviDépôtGarantiesFinancièresReadModel = ReadModel<
  'suivi-dépôt-garanties-financières',
  {
    identifiantProjet: RawIdentifiantProjet;
    dateLimiteDépôt?: string;
    région: string;
    statutDépôt: 'en attente' | 'en cours' | 'validé';
  }
>;
