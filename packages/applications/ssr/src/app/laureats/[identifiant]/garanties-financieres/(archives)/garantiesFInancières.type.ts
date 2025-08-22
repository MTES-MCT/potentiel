import type { GarantiesFinancières } from '@potentiel-domain/laureat';
import type { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import type { CommonGarantiesFinancières } from '../garantiesFinancières.type';

export type GarantiesFinancièresArchivées = CommonGarantiesFinancières & {
  statut: GarantiesFinancières.StatutGarantiesFinancières.RawType;
  motif: GarantiesFinancières.MotifArchivageGarantiesFinancières.RawType;
  dateConstitution?: Iso8601DateTime;
  attestation?: string;
  validéLe?: Iso8601DateTime;
  soumisLe?: Iso8601DateTime;
};
