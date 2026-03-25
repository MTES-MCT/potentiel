import { DateTime } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../index.js';

type Domain = `producteur`;
type TypeDocument = 'pièce-justificative';
type RawType = `${Domain}/${TypeDocument}`;

const pièceJustificativeDocumentType: RawType = `producteur/pièce-justificative`;

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
  enregistréLe: DateTime.RawType;
  pièceJustificative: { format: string };
};

export const pièceJustificative = ({
  enregistréLe,
  identifiantProjet,
  pièceJustificative,
}: Props) =>
  DocumentProjet.convertirEnValueType(
    identifiantProjet,
    pièceJustificativeDocumentType,
    enregistréLe,
    pièceJustificative.format,
  );
