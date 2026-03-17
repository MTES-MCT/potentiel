import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const garantiesFinancièresDemandéesProjector = async ({
  payload: { identifiantProjet, demandéLe, motif, dateLimiteSoumission },
}: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent) => {
  // dans le cas d'une échéance, on garde les données existantes, dont le statut
  if (motif === 'échéance-garanties-financières-actuelles') {
    await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet}`,
      {
        enAttente: {
          motif,
          dateLimiteSoumission,
        },
        dernièreMiseÀJour: {
          date: demandéLe,
        },
      },
    );
    return;
  }

  // dans les autres cas, il s'agit d'une initialisation des garanties financières.
  await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.enAttente.statut,
      enAttente: {
        motif,
        dateLimiteSoumission,
      },
      dernièreMiseÀJour: {
        date: demandéLe,
      },
    },
  );
};
