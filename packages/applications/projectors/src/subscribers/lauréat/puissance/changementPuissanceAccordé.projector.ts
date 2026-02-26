import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementPuissanceAccordéProjector = async ({
  payload: {
    identifiantProjet,
    accordéLe,
    accordéPar,
    nouvellePuissance,
    nouvellePuissanceDeSite,
    réponseSignée,
  },
}: Lauréat.Puissance.ChangementPuissanceAccordéEvent) => {
  await updateOneProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    puissanceDeSite: nouvellePuissanceDeSite,
    puissance: nouvellePuissance,
    miseÀJourLe: accordéLe,
    dernièreDemande: { statut: Lauréat.Puissance.StatutChangementPuissance.accordé.statut },
  });

  await updateManyProjections<Lauréat.Puissance.ChangementPuissanceEntity>(
    'changement-puissance',
    {
      identifiantProjet: Where.equal(identifiantProjet),
      demande: {
        statut: Where.equal(Lauréat.Puissance.StatutChangementPuissance.demandé.statut),
      },
    },
    {
      miseÀJourLe: accordéLe,
      demande: {
        statut: Lauréat.Puissance.StatutChangementPuissance.accordé.statut,
        accord: {
          accordéeLe: accordéLe,
          accordéePar: accordéPar,
          réponseSignée,
        },
      },
    },
  );
};
