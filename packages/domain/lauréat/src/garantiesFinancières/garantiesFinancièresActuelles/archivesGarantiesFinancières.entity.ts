import { Entity } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';

export type ArchiveGarantiesFinancières =
  Lauréat.GarantiesFinancières.GarantiesFinancièresDétails & {
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
