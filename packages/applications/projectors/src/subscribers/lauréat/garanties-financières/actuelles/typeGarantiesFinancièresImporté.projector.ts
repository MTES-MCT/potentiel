import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const typeGarantiesFinancièresImportéProjector = async ({
  payload: { identifiantProjet, importéLe, type, dateÉchéance, dateDélibération },
}: Lauréat.GarantiesFinancières.TypeGarantiesFinancièresImportéEvent) => {
  await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      garantiesFinancières: {
        type,
        statut: 'validé',
        dateÉchéance,
        dateDélibération,
        dernièreMiseÀJour: {
          date: importéLe,
        },
      },
    },
  );

  await removeProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEnAttenteEntity>(
    `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
  );
};
