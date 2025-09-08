import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Lauréat } from '@potentiel-domain/projet';

import { CommonGarantiesFinancières } from '../garantiesFinancières.type';

export type GarantiesFinancièresArchivées = CommonGarantiesFinancières & {
  statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.RawType;
  motif: Lauréat.GarantiesFinancières.MotifArchivageGarantiesFinancières.RawType;
  dateConstitution?: Iso8601DateTime;
  attestation?: string;
  validéLe?: Iso8601DateTime;
  soumisLe?: Iso8601DateTime;
};
