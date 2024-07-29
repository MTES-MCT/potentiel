import { IdentifiantProjet } from '@potentiel-domain/common';

import {
  CommonGarantiesFinancièresExempleData,
  defaultCommonGarantiesFinancièresData,
  getCommonGarantiesFinancièresData,
} from './getCommonGarantiesFinancièresData';

export const defaultGarantiesFinancièresActuellesEnAttenteData = {
  ...defaultCommonGarantiesFinancièresData,
  notifiéLe: '2024-01-01',
  dateLimiteSoumission: '2024-01-03',
  motif: 'motif-inconnu',
};

export type GarantiesFinancièresActuellesEnAttenteExempleData =
  CommonGarantiesFinancièresExempleData & {
    'date de notification'?: string;
    'date limite de soumission'?: string;
    motif?: string;
  };

export const getGarantiesFinancièresActuellesEnAttenteData = (
  identifiantProjet: IdentifiantProjet.ValueType,
  exemple: GarantiesFinancièresActuellesEnAttenteExempleData,
) => ({
  ...getCommonGarantiesFinancièresData(identifiantProjet, exemple),
  demandéLeValue: new Date(
    exemple['date de notification'] ?? defaultGarantiesFinancièresActuellesEnAttenteData.notifiéLe,
  ).toISOString(),
  dateLimiteSoumissionValue: new Date(
    exemple['date limite de soumission'] ??
      defaultGarantiesFinancièresActuellesEnAttenteData.dateLimiteSoumission,
  ).toISOString(),
  motifValue: exemple['motif'] ?? defaultGarantiesFinancièresActuellesEnAttenteData.motif,
});
