import { Entity } from '@potentiel-domain/entity';

import { GarantiesFinancièresDetails } from './types';

export type GarantiesFinancièresEntity = Entity<
  'garanties-financieres',
  {
    identifiantProjet: string;

    garantiesFinancières: GarantiesFinancièresDetails;
  }
>;
