import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const garantiesFinancièresDemandéesProjector = async ({
  payload: { identifiantProjet, demandéLe, motif, dateLimiteSoumission },
}: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent) => {
  if (motif === 'non-déposé' || motif === 'recours-accordé') {
    await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet}`,
      {
        identifiantProjet,
        garantiesFinancières: {
          statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.enAttente.statut,
          motifEnAttente: motif,
          dateLimiteSoumission,
          type: 'type-inconnu',
          dateÉchéance: undefined,
          dernièreMiseÀJour: {
            date: demandéLe,
          },
        },
      },
    );
    return;
  }

  await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      garantiesFinancières: {
        motifEnAttente: motif,
        dateLimiteSoumission,
        dernièreMiseÀJour: {
          date: demandéLe,
        },
      },
    },
  );
};
