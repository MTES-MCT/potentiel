import { Entity } from '@potentiel-domain/entity';

import { GarantiesFinancièresDetails } from './types';

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
    projet: {
      nom: string;
      région: string;
      appelOffre: string;
      période: string;
      famille?: string;
    };
    archives: ReadonlyArray<ArchiveGarantiesFinancières>;
  }
>;
