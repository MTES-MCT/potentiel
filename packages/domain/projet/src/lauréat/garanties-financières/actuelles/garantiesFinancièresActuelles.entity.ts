import { Entity } from '@potentiel-domain/entity';

import { GarantiesFinancièresDétails } from './garantiesFinancièresDétails.type';

export type GarantiesFinancièresEntity = Entity<
  'garanties-financieres',
  {
    identifiantProjet: string;

    garantiesFinancières: GarantiesFinancièresDétails;
  }
>;
