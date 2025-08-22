import type { Entity } from '@potentiel-domain/entity';

import type { GarantiesFinancièresDetails } from './types';

export type ArchiveGarantiesFinancières = GarantiesFinancièresDetails & {
  motif:
    | 'changement de producteur'
    | 'renouvellement des garanties financières échues'
    | 'modification des garanties financières';
};

export type ArchivesGarantiesFinancièresEntity = Entity<
  'archives-garanties-financieres',
  {
    identifiantProjet: string;

    archives: ReadonlyArray<ArchiveGarantiesFinancières>;
  }
>;
