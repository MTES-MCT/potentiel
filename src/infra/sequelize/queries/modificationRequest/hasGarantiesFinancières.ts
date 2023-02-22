import { wrapInfra } from '@core/utils';
import { HasGarantiesFinancières } from '@modules/modificationRequest';
import models from '../../models';

const { GarantiesFinancières } = models;

export const hasGarantiesFinancières: HasGarantiesFinancières = (projetId) => {
  return wrapInfra(
    GarantiesFinancières.findOne({
      where: { projetId, statut: ['à traiter', 'validé'] },
    }),
  ).map((garantiesFinancières) => !!garantiesFinancières);
};
