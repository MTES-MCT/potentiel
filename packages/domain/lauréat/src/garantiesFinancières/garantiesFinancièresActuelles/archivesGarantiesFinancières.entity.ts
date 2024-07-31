import { Entity } from '@potentiel-domain/core';

import { GarantiesFinancièresDetails } from './types';

export type ArchivesGarantiesFinancièresEntity = Entity<
  'archives-garanties-financieres',
  {
    identifiantProjet: string;
    nomProjet: string;
    régionProjet: string;
    appelOffre: string;
    période: string;
    famille: string;
    archives: Array<GarantiesFinancièresDetails>;
  }
>;
