import { IdentifiantProjet } from '@potentiel-domain/common';

import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

export const defaultCommonGarantiesFinancièresData = {
  typeGarantiesFinancières: 'consignation',
  dateÉchéance: undefined,
  format: 'application/pdf',
  dateConstitution: '2024-01-01',
  contenuFichier: 'contenu fichier',
  dateEffacageHistorique: '2024-01-02',
  effacéPar: 'admin@test.test',
};

export type CommonGarantiesFinancièresExempleData = {
  type?: string;
  "date d'échéance"?: string;
  'date de constitution'?: string;
  format?: string;
  'contenu fichier'?: string;
  "date de l'effaçage de l'historique"?: string;
  'effacé par'?: string;
};

export const getCommonGarantiesFinancièresData = (
  identifiantProjet: IdentifiantProjet.ValueType,
  exemple: CommonGarantiesFinancièresExempleData,
) => ({
  identifiantProjetValue: identifiantProjet.formatter(),
  typeValue: exemple.type ?? defaultCommonGarantiesFinancièresData.typeGarantiesFinancières,
  dateÉchéanceValue: exemple[`date d'échéance`]
    ? new Date(exemple[`date d'échéance`]).toISOString()
    : defaultCommonGarantiesFinancièresData.dateÉchéance,
  dateConstitutionValue: new Date(
    exemple[`date de constitution`] ?? defaultCommonGarantiesFinancièresData.dateConstitution,
  ).toISOString(),
  attestationValue: {
    content: convertStringToReadableStream(
      exemple['contenu fichier'] ?? defaultCommonGarantiesFinancièresData.contenuFichier,
    ),
    format: exemple.format ?? defaultCommonGarantiesFinancièresData.format,
  },
  effacéLeValue: new Date(
    exemple["date de l'effaçage de l'historique"] ??
      defaultCommonGarantiesFinancièresData.dateEffacageHistorique,
  ).toISOString(),
  effacéParValue: exemple['effacé par'] ?? defaultCommonGarantiesFinancièresData.effacéPar,
});
