import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const typeGarantiesFinancièresImportéProjector = async ({
  payload: { identifiantProjet, importéLe, type, dateÉchéance },
}: Lauréat.GarantiesFinancières.TypeGarantiesFinancièresImportéEvent) => {
  await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      garantiesFinancières: {
        type,
        statut: 'validé',
        dateÉchéance,
        dernièreMiseÀJour: {
          date: importéLe,
        },
      },
    },
  );
};
