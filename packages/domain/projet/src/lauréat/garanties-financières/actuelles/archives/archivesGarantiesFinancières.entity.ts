import { Entity } from '@potentiel-domain/entity';

import { StatutGarantiesFinancières } from '../../index.js';

type GarantiesFinancièresDétails = {
  statut: StatutGarantiesFinancières.RawType;
  motifEnAttente?: string;
  dateLimiteSoumission?: string;
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

export type ArchiveGarantiesFinancières = GarantiesFinancièresDétails & {
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
