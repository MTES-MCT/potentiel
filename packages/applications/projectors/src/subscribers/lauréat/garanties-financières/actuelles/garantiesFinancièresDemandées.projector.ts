import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

export const garantiesFinancièresDemandéesProjector = async ({
  payload: { identifiantProjet, demandéLe, motif, dateLimiteSoumission },
  version,
}: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent & Event) => {
  const enAttente = {
    motif,
    dateLimiteSoumission,
  };
  const dernièreMiseÀJour = { date: demandéLe };

  // dans le cas d'une échéance, on garde les données existantes, dont le statut
  if (motif === 'échéance-garanties-financières-actuelles') {
    await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet}`,
      { enAttente, dernièreMiseÀJour },
    );
    return;
  }

  // Mise à jour d'une projection déjà existante (identique à ci-dessus, mais avec une mise à jour du statut)
  if (version > 1) {
    await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet}`,
      {
        statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.nonDéposé.statut,
        enAttente,
        dernièreMiseÀJour,
      },
    );
    return;
  }

  // dans les autres cas, il s'agit d'une initialisation des garanties financières.
  await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.nonDéposé.statut,
      enAttente,
      dernièreMiseÀJour,
      archives: [],
    },
  );
};
