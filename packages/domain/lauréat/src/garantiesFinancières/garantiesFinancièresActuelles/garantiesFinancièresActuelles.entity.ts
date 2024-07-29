import { Entity } from '@potentiel-domain/core';

import { StatutGarantiesFinancières } from '..';

export type GarantiesFinancièresDetailsEntity = {
  statut: StatutGarantiesFinancières.RawType;
  type: string;
  dateÉchéance?: string;
  attestation?: { format: string };
  dateConstitution?: string;
  soumisLe?: string;
  validéLe?: string;
  typeImportéLe?: string;
  dernièreMiseÀJour: {
    date: string;
    par?: string;
  };
};

export type GarantiesFinancièresEntity = Entity<
  'garanties-financieres',
  {
    identifiantProjet: string;
    nomProjet: string;
    régionProjet: string;
    appelOffre: string;
    période: string;
    famille?: string;
    garantiesFinancières: GarantiesFinancièresDetailsEntity;
  }
>;
