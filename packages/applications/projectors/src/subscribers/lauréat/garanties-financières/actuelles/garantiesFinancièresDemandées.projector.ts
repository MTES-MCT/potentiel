import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const garantiesFinancièresDemandéesProjector = async ({
  payload: { identifiantProjet, demandéLe, motif, dateLimiteSoumission },
}: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent) => {
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
};
