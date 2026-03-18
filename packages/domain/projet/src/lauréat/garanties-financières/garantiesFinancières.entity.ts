import { Entity } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../index.js';

import {
  GarantiesFinancières,
  MotifDemandeGarantiesFinancières,
  StatutGarantiesFinancières,
} from './index.js';

export type GarantiesFinancièresEntity = Entity<
  'garanties-financieres',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    statut: StatutGarantiesFinancières.RawType;
    enAttente?: {
      motif: MotifDemandeGarantiesFinancières.RawType;
      dateLimiteSoumission: DateTime.RawType;
    };
    actuelles?: GarantiesFinancières.RawType;

    soumisLe?: DateTime.RawType;
    validéLe?: DateTime.RawType;
    dernièreMiseÀJour: {
      date: DateTime.RawType;
      par?: Email.RawType;
    };
  }
>;
