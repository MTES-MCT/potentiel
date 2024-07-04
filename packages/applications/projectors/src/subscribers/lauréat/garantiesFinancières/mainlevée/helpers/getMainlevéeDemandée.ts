import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { listProjection } from '@potentiel-infrastructure/pg-projections';

export const getMainlevéeDemandée = async (identifiantProjet: string) => {
  const mainlevéesDemandées =
    await listProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
      'mainlevee-garanties-financieres',
      {
        where: {
          identifiantProjet: {
            operator: 'equal',
            value: identifiantProjet,
          },
          statut: {
            operator: 'equal',
            value: 'demandé',
          },
        },
      },
    );

  return mainlevéesDemandées.total === 1 ? mainlevéesDemandées.items[0] : undefined;
};
