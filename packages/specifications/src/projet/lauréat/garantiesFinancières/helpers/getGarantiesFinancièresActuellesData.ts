import { IdentifiantProjet } from '@potentiel-domain/common';

import {
  CommonGarantiesFinancièresExempleData,
  defaultCommonGarantiesFinancièresData,
  getCommonGarantiesFinancièresData,
} from './getCommonGarantiesFinancièresData';

export const defaultGarantiesFinancièresActuellesData = {
  ...defaultCommonGarantiesFinancièresData,
  importéLe: '2024-01-01',
  modifiéLe: '2024-01-02',
  modifiéPar: 'dreal@test.test',
  enregistréLe: '2024-01-03',
  enregistréPar: 'dreal@test.test',
  échuLe: '2024-01-04',
  validéLe: '2024-01-05',
};

export type GarantiesFinancièresActuellesExempleData = CommonGarantiesFinancièresExempleData & {
  "date d'import"?: string;
  'date de modification'?: string;
  'modifié par'?: string;
  "date d'enregistrement"?: string;
  'enregistré par'?: string;
  'date à vérifier pour échéance'?: string;
  'date de validation'?: string;
};

export const getGarantiesFinancièresActuellesData = (
  identifiantProjet: IdentifiantProjet.ValueType,
  exemple: GarantiesFinancièresActuellesExempleData,
) => ({
  ...getCommonGarantiesFinancièresData(identifiantProjet, exemple),
  importéLeValue: new Date(
    exemple["date d'import"] ?? defaultGarantiesFinancièresActuellesData.importéLe,
  ).toISOString(),
  modifiéLeValue: new Date(
    exemple['date de modification'] ?? defaultGarantiesFinancièresActuellesData.modifiéLe,
  ).toISOString(),
  modifiéParValue: exemple['modifié par'] ?? defaultGarantiesFinancièresActuellesData.modifiéPar,
  enregistréLeValue: new Date(
    exemple["date d'enregistrement"] ?? defaultGarantiesFinancièresActuellesData.enregistréLe,
  ).toISOString(),
  enregistréParValue:
    exemple['enregistré par'] ?? defaultGarantiesFinancièresActuellesData.enregistréPar,
  échuLeValue: new Date(
    exemple['date à vérifier pour échéance'] ?? defaultGarantiesFinancièresActuellesData.échuLe,
  ).toISOString(),
  validéLeValue: exemple['date de validation'] ?? defaultGarantiesFinancièresActuellesData.validéLe,
});
