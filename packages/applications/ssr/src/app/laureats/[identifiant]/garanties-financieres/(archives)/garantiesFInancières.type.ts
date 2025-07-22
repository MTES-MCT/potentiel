import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { CommonGarantiesFinancières } from '../garantiesFinancières.type';

export type GarantiesFinancièresArchivées = CommonGarantiesFinancières & {
  statut: GarantiesFinancières.StatutGarantiesFinancières.RawType;
  motif: GarantiesFinancières.MotifArchivageGarantiesFinancières.RawType;
  dateConstitution?: Iso8601DateTime;
  attestation?: string;
  validéLe?: Iso8601DateTime;
  soumisLe?: Iso8601DateTime;
};
