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
      statut: Lauréat.Puissance.StatutChangementPuissance.demandé.statut,
      demande: {
        nouvellePuissance: puissance,
        nouvellePuissanceDeSite: puissanceDeSite,
        demandéPar,
        demandéLe,
        raison,
        pièceJustificative: {
          format,
        },
      },
    },
  );
};
