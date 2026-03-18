import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const typeGarantiesFinancièresImportéProjector = async ({
  payload: { identifiantProjet, importéLe, type, dateÉchéance },
}: Lauréat.GarantiesFinancières.TypeGarantiesFinancièresImportéEvent) => {
  await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      statut: 'validé',
      actuelles: Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
        type,
        dateÉchéance,
      }).formatter(),
      dernièreMiseÀJour: {
        date: importéLe,
      },
    },
  );
};
