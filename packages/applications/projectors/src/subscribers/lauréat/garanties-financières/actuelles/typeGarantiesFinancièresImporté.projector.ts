import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const typeGarantiesFinancièresImportéProjector = async ({
  payload: { identifiantProjet, importéLe, type, dateÉchéance },
}: Lauréat.GarantiesFinancières.TypeGarantiesFinancièresImportéEvent) => {
  await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
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

  await removeProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
    `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
  );
};
