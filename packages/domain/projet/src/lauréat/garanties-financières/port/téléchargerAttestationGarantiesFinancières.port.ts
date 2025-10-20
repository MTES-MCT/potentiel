import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

export type TéléchargerAttestationGarantiesFinancièresPort = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<{
  attestation: {
    content: ReadableStream<Uint8Array<ArrayBufferLike>>;
    format: string;
  };
  dateConstitution: DateTime.RawType;
}>;
