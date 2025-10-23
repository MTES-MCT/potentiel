import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

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
