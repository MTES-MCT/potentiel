import { DocumentProjet } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../..';
import { GarantiesFinancières } from '..';

export type RécupérerGarantiesFinancièresPort = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<
  | {
      garantiesFinancières: GarantiesFinancières.ValueType;
      attestation:
        | {
            content: ReadableStream;
            key: DocumentProjet.ValueType;
          }
        | undefined;
    }
  | undefined
>;
