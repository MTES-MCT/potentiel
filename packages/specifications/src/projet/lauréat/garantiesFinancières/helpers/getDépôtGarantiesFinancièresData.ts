import { IdentifiantProjet } from '@potentiel-domain/common';

import {
  CommonGarantiesFinancièresExempleData,
  defaultCommonGarantiesFinancièresData,
  getCommonGarantiesFinancièresData,
} from './getCommonGarantiesFinancièresData';

export const defaultDépôtGarantiesFinancièresData = {
  ...defaultCommonGarantiesFinancièresData,
  dateSoumission: '2024-01-02',
  soumisPar: 'porteur@test.test',
  dateModification: '2024-01-03',
  modifiéPar: 'user@test.test',
  dateSuppression: '2024-01-04',
  suppriméPar: 'porteur@test.test',
  dateValidation: '2024-01-05',
  validéPar: 'dreal@test.test',
  dernièreMiseÀJour: {
    date: '2024-01-06',
    par: 'porteur@test.test',
  },
};

export type DépôtGarantiesFinancièresExempleData = CommonGarantiesFinancièresExempleData & {
  'date de soumission'?: string;
  'soumis par'?: string;
  'date de modification'?: string;
  'modifié par'?: string;
  'date de suppression'?: string;
  'supprimé par'?: string;
  'date de validation'?: string;
  'validé par'?: string;
  'date de dernière mise à jour'?: string;
  'mis à jour par'?: string;
};

export const getDépôtGarantiesFinancièresData = (
  identifiantProjet: IdentifiantProjet.ValueType,
  exemple: DépôtGarantiesFinancièresExempleData,
) => ({
  ...getCommonGarantiesFinancièresData(identifiantProjet, exemple),
  soumisParValue: exemple['soumis par'] ?? defaultDépôtGarantiesFinancièresData.soumisPar,
  soumisLeValue: new Date(
    exemple['date de soumission'] ?? defaultDépôtGarantiesFinancièresData.dateSoumission,
  ).toISOString(),
  modifiéLeValue: new Date(
    exemple['date de modification'] ?? defaultDépôtGarantiesFinancièresData.dateModification,
  ).toISOString(),
  modifiéParValue: exemple['modifié par'] ?? defaultDépôtGarantiesFinancièresData.modifiéPar,
  suppriméLeValue: new Date(
    exemple['date de suppression'] ?? defaultDépôtGarantiesFinancièresData.dateSuppression,
  ).toISOString(),
  suppriméParValue: exemple['supprimé par'] ?? defaultDépôtGarantiesFinancièresData.suppriméPar,
  validéLeValue: new Date(
    exemple['date de validation'] ?? defaultDépôtGarantiesFinancièresData.dateValidation,
  ).toISOString(),
  validéParValue: exemple['validé par'] ?? defaultDépôtGarantiesFinancièresData.validéPar,
  dernièreMiseÀJour: {
    date: new Date(
      exemple['date de dernière mise à jour'] ??
        defaultDépôtGarantiesFinancièresData.dernièreMiseÀJour.date,
    ).toISOString(),
    par: exemple['mis à jour par'] ?? defaultDépôtGarantiesFinancièresData.dernièreMiseÀJour.par,
  },
});
