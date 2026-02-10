import { Entity } from '@potentiel-domain/entity';

import { StatutGarantiesFinancières } from '../index.js';

export type GarantiesFinancièresDétails = {
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

    garantiesFinancières: GarantiesFinancièresDétails;
  }
>;
