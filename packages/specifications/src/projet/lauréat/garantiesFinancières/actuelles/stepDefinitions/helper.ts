import { IdentifiantProjet } from '@potentiel-domain/common';

import {
  CommonGarantiesFinancières,
  defaultCommonGarantiesFinancièresData,
  setCommonGarantiesFinancières,
} from '../../helper';

type GarantiesFinancièresActuelles = CommonGarantiesFinancières & {
  validéLe: string;
  validéPar: string;
  importéLe: string;
};

export const defaultGarantiesFinancièresActuellesData: GarantiesFinancièresActuelles = {
  ...defaultCommonGarantiesFinancièresData,
  validéLe: '2024-01-03',
  validéPar: 'dreal@test.test',
  importéLe: new Date().toISOString(),
};

type SetGarantiesFinancièresActuellesDataProps = Partial<GarantiesFinancièresActuelles> & {
  identifiantProjet: IdentifiantProjet.ValueType;
};

export const setGarantiesFinancièresData = ({
  identifiantProjet,
  typeGarantiesFinancières,
  dateÉchéance,
  format,
  dateConstitution,
  contenuFichier,
  validéLe,
  validéPar,
}: SetGarantiesFinancièresActuellesDataProps) => ({
  ...setCommonGarantiesFinancières({
    identifiantProjet,
    typeGarantiesFinancières,
    dateÉchéance,
    format,
    dateConstitution,
    contenuFichier,
  }),
  validéLeValue: new Date(
    validéLe ?? defaultGarantiesFinancièresActuellesData.validéLe,
  ).toISOString(),
  validéParValue: validéPar ?? defaultGarantiesFinancièresActuellesData.validéPar,
  importéLeValue: new Date().toISOString(),
});
