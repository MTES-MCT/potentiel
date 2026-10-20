import { Lauréat } from '@potentiel-domain/projet';
import {
  type DeepUndefined,
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const mainlevéeGarantiesFinancièresAccordéeProjector = async ({
  payload: { identifiantProjet, accordéLe, accordéPar, motif },
}: Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresAccordéeEvent) => {
  await upsertProjection<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres|${identifiantProjet}#${accordéLe}`,
    {
      identifiantProjet,
      motif,
      statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.demandé.statut,
      dernièreMiseÀJour: {
        date: accordéLe,
        par: accordéPar,
      },
    },
  );

  await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      statut: 'levé',
      enAttente: {
        dateLimiteSoumission: undefined,
        motif: undefined,
      } satisfies DeepUndefined<
        Lauréat.GarantiesFinancières.GarantiesFinancièresEntity['enAttente']
      >,
      dernièreMiseÀJour: {
        date: accordéLe,
        par: accordéPar,
      },
    },
  );
};
