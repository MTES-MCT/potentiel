import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const garantiesFinancièresDemandéesProjector = async ({
  payload: { identifiantProjet, demandéLe, motif, dateLimiteSoumission },
}: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent) => {
  await upsertProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
    `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
    {
      identifiantProjet,
      motif,
      dateLimiteSoumission,
      dernièreMiseÀJour: {
        date: demandéLe,
      },
    },
  );
};
