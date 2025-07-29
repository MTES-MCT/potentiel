import {
  setCommonGarantiesFinancières,
  SetCommonGarantiesFinancièresDataProps,
} from '../../helper';

/** @deprecated use fixtures */
export const setGarantiesFinancièresData = ({
  identifiantProjet,
  exemple,
}: SetCommonGarantiesFinancièresDataProps) => ({
  ...setCommonGarantiesFinancières({
    identifiantProjet,
    exemple,
  }),
  validéLeValue: new Date(exemple?.['date de validation'] ?? '2024-01-03').toISOString(),
  validéParValue: exemple?.['validé par'] ?? 'dreal@test.test',
  enregistréLeValue: new Date(exemple?.['date demise à jour'] ?? '2024-01-01').toISOString(),
  enregistréParValue: exemple?.['enregistré par'] ?? 'porteur@test.test',
  modifiéLeValue: new Date(exemple?.['date mise à jour'] ?? '2024-01-01').toISOString(),
  modifiéParValue: exemple?.['modifié par'] ?? 'admin@test.test',
  importéLeValue: new Date(exemple?.["date d'import"] ?? '2024-01-01').toISOString(),
  statutValue: exemple?.statut ?? 'validé',
});
