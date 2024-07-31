import { IdentifiantProjet } from '@potentiel-domain/common';

import {
  CommonGarantiesFinancières,
  defaultCommonGarantiesFinancièresData,
  setCommonGarantiesFinancières,
} from '../../helper';

type Dépôt = CommonGarantiesFinancières & {
  dateSoumission: string;
  soumisPar: string;
};

export const defaultDépôtData: Dépôt = {
  ...defaultCommonGarantiesFinancièresData,
  dateSoumission: '2024-01-02',
  soumisPar: 'user@test.test',
};

type SetDépôtDataProps = Partial<Dépôt> & {
  identifiantProjet: IdentifiantProjet.ValueType;
};

export const setDépôtData = ({
  dateSoumission,
  soumisPar,
  identifiantProjet,
  contenuFichier,
  dateConstitution,
  dateÉchéance,
  format,
  typeGarantiesFinancières,
}: SetDépôtDataProps) => ({
  ...setCommonGarantiesFinancières({
    identifiantProjet,
    typeGarantiesFinancières,
    dateÉchéance,
    format,
    dateConstitution,
    contenuFichier,
  }),
  soumisLeValue: new Date(dateSoumission ?? defaultDépôtData.dateSoumission).toISOString(),
  soumisParValue: soumisPar ?? defaultDépôtData.soumisPar,
});
