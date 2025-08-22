import type { Entity } from '@potentiel-domain/entity';

import type { GarantiesFinancièresDetails } from './types';

export type GarantiesFinancièresEntity = Entity<
  'garanties-financieres',
  {
    identifiantProjet: string;

    garantiesFinancières: GarantiesFinancièresDetails;
  }
>;
