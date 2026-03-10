import { Lauréat } from '@potentiel-domain/projet';
import { updateManyProjections } from '@potentiel-infrastructure/pg-projection-write';
import { Where } from '@potentiel-domain/entity';

export const demandeMainlevéeGarantiesFinancièresRejetéeProjector = async ({
  payload: { identifiantProjet, rejetéLe, rejetéPar, réponseSignée },
}: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent) => {
  await updateManyProjections<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres`,
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.matchAny(
        Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.statutsEnCours,
      ),
    },

    {
      statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.rejeté.statut,
      rejet: {
        rejetéLe,
        rejetéPar,
        courrierRejet: { format: réponseSignée.format },
      },
      dernièreMiseÀJour: {
        date: rejetéLe,
        par: rejetéPar,
      },
    },
  );
};
