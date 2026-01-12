import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Where } from '@potentiel-domain/entity';

export const changementPuissanceAnnuléProjector = async ({
  payload: { identifiantProjet, annuléLe },
}: Lauréat.Puissance.ChangementPuissanceAnnuléEvent) => {
  await updateManyProjections<Lauréat.Puissance.ChangementPuissanceEntity>(
    `changement-puissance`,
    {
      identifiantProjet: Where.equal(identifiantProjet),
      demande: {
        statut: Where.equal(Lauréat.Puissance.StatutChangementPuissance.demandé.statut),
      },
    },
    {
      miseÀJourLe: annuléLe,
      demande: {
        statut: Lauréat.Puissance.StatutChangementPuissance.annulé.statut,
      },
    },
  );

  await updateOneProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    dateDemandeEnCours: undefined,
  });
};
