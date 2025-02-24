import { Entity } from '@potentiel-domain/entity';

import { GarantiesFinancièresDetails } from './types';

export type GarantiesFinancièresEntity = Entity<
  'garanties-financieres',
  {
    identifiantProjet: string;

    projet: {
      nom: string;
      région: string;
      appelOffre: string;
      période: string;
      famille?: string;
    };

    garantiesFinancières: GarantiesFinancièresDetails;
  }
>;
