import { IdentifiantProjet } from '@potentiel-domain/common';

import { convertStringToReadableStream } from '../../../helpers/convertStringToReadable';

export type CommonGarantiesFinancières = typeof defaultCommonGarantiesFinancièresData & {
  dateÉchéance?: string;
};

export const defaultCommonGarantiesFinancièresData = {
  typeGarantiesFinancières: 'consignation',
  format: 'application/pdf',
  dateConstitution: '2024-01-01',
  contenuFichier: 'contenu fichier',
};

type SetCommonGarantiesFinancièresDataProps = Partial<CommonGarantiesFinancières> & {
  identifiantProjet: IdentifiantProjet.ValueType;
};

export const setCommonGarantiesFinancières = ({
  identifiantProjet,
  typeGarantiesFinancières,
  dateÉchéance,
  format,
  dateConstitution,
  contenuFichier,
}: SetCommonGarantiesFinancièresDataProps) => ({
  identifiantProjetValue: identifiantProjet.formatter(),
  typeValue:
    typeGarantiesFinancières ?? defaultCommonGarantiesFinancièresData.typeGarantiesFinancières,
  dateÉchéanceValue: dateÉchéance ? new Date(dateÉchéance).toISOString() : undefined,
  dateConstitutionValue: new Date(
    dateConstitution ?? defaultCommonGarantiesFinancièresData.dateConstitution,
  ).toISOString(),
  attestationValue: {
    format: format ?? defaultCommonGarantiesFinancièresData.format,
    content: convertStringToReadableStream(
      contenuFichier ?? defaultCommonGarantiesFinancièresData.contenuFichier,
    ),
  },
});
