import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const mainlevéeGarantiesFinancièresDemandéeProjector = async ({
  payload: { identifiantProjet, demandéLe, demandéPar, motif },
}: Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent) => {
  await upsertProjection<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres|${identifiantProjet}#${demandéLe}`,
    {
      identifiantProjet,
      demande: {
        demandéeLe: demandéLe,
        demandéePar: demandéPar,
      },
      motif,
      statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.demandé.statut,
      dernièreMiseÀJour: {
        date: demandéLe,
        par: demandéPar,
      },
    },
  );
};
