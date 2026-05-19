import type { DateTime, Email } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { IdentifiantProjet } from '../../index.js';
import type {
  GarantiesFinancières,
  MotifArchivageGarantiesFinancières,
  MotifDemandeGarantiesFinancières,
  StatutGarantiesFinancières,
} from './index.js';

export type ArchiveGarantiesFinancières = {
  garantiesFinancières: GarantiesFinancières.RawType;
  motifArchivage: MotifArchivageGarantiesFinancières.RawType;
  validéLe: DateTime.RawType;
};

export type GarantiesFinancièresEntity = Entity<
  'garanties-financieres',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    statut: StatutGarantiesFinancières.RawType;
    enAttente?: {
      motif: MotifDemandeGarantiesFinancières.RawType;
      dateLimiteSoumission: DateTime.RawType;
    };
    actuelles?: GarantiesFinancières.RawType & {
      validéLe: DateTime.RawType;
    };
    soumisLe?: DateTime.RawType;

    dernièreMiseÀJour: {
      date: DateTime.RawType;
      par?: Email.RawType;
    };

    archives: ArchiveGarantiesFinancières[];

    dépôt?: GarantiesFinancières.RawType & {
      constitution: NonNullable<GarantiesFinancières.RawType['constitution']>;
      soumisLe: DateTime.RawType;
      soumisPar: Email.RawType;
      dernièreMiseÀJour: {
        date: DateTime.RawType;
        par: Email.RawType;
      };
    };
  }
>;
