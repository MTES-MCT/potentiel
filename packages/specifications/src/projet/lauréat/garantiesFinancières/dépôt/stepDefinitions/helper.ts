import {
  setCommonGarantiesFinancières,
  SetCommonGarantiesFinancièresDataProps,
} from '../../helper';

export const setDépôtData = ({
  exemple,
  identifiantProjet,
}: SetCommonGarantiesFinancièresDataProps) => ({
  ...setCommonGarantiesFinancières({
    exemple,
    identifiantProjet,
  }),
  soumisLeValue: new Date(exemple?.['date de soumission'] ?? '2024-01-02').toISOString(),
  soumisParValue: exemple?.['soumis par'] ?? 'porteur@test.test',
});
