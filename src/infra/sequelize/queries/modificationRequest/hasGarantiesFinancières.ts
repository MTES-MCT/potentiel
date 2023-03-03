import { wrapInfra } from '@core/utils';
import { GarantiesFinancières } from '@infra/sequelize/projectionsNext';
import { HasGarantiesFinancières } from '@modules/modificationRequest';

export const hasGarantiesFinancières: HasGarantiesFinancières = (projetId) => {
  return wrapInfra(
    GarantiesFinancières.findOne({
      where: { projetId, statut: ['à traiter', 'validé'] },
    }),
  ).map((garantiesFinancières) => !!garantiesFinancières);
};
