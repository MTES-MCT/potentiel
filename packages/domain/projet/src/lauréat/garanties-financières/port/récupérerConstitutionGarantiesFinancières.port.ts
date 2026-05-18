import type { DateTime } from '@potentiel-domain/common';

import type { IdentifiantProjet } from '../../../index.js';

export type RécupererConstitutionGarantiesFinancièresPort = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<
  | {
      dateConstitution: DateTime.RawType;
      attestation: {
        content: ReadableStream;
        format: string;
      };
    }
  | undefined
>;
