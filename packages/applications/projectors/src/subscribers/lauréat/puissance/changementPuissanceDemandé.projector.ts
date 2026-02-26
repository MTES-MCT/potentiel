import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementPuissanceDemandéProjector = async ({
  payload: {
    puissance,
    puissanceDeSite,
    identifiantProjet,
    demandéLe,
    demandéPar,
    raison,
    pièceJustificative: { format },
  },
}: Lauréat.Puissance.ChangementPuissanceDemandéEvent) => {
  await updateOneProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    dernièreDemande: {
      statut: Lauréat.Puissance.StatutChangementPuissance.demandé.statut,
      date: demandéLe,
    },
  });

  await upsertProjection<Lauréat.Puissance.ChangementPuissanceEntity>(
    `changement-puissance|${identifiantProjet}#${demandéLe}`,
    {
      identifiantProjet,
      miseÀJourLe: demandéLe,
      demande: {
        statut: Lauréat.Puissance.StatutChangementPuissance.demandé.statut,
        nouvellePuissance: puissance,
        nouvellePuissanceDeSite: puissanceDeSite,
        demandéePar: demandéPar,
        demandéeLe: demandéLe,
        raison,
        pièceJustificative: {
          format,
        },
      },
    },
  );
};
