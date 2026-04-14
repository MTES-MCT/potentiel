import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  DeepUndefined,
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const demandeMainlevéeGarantiesFinancièresAccordéeProjector = async ({
  payload: { identifiantProjet, accordéLe, accordéPar, réponseSignée },
}: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent) => {
  await updateManyProjections<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres`,
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.matchAny(
        Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.statutsEnCours,
      ),
    },
    {
      statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.accordé.statut,
      accord: {
        accordéeLe: accordéLe,
        accordéePar: accordéPar,
        courrierAccord: { format: réponseSignée.format },
      },
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
