import { IdentifiantProjet } from '@potentiel-domain/common';

import { convertStringToReadableStream } from '../../../helpers/convertStringToReadable';

export type SetCommonGarantiesFinancièresDataProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  exemple?: Record<string, string>;
};

export const setCommonGarantiesFinancières = ({
  identifiantProjet,
  exemple,
}: SetCommonGarantiesFinancièresDataProps) => ({
  identifiantProjetValue: identifiantProjet.formatter(),
  typeValue: exemple?.type ?? 'consignation',
  dateÉchéanceValue: exemple?.["date d'échéance"]
    ? new Date(exemple?.["date d'échéance"]).toISOString()
    : undefined,
  dateConstitutionValue: new Date(exemple?.['date de constitution'] ?? '2024-01-01').toISOString(),
  attestationValue: {
    format: exemple?.format ?? 'application/pdf',
    content: convertStringToReadableStream(exemple?.['contenu fichier'] ?? 'contenu fichier'),
  },
});
