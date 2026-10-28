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
    autoritéCompétente,
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
      statut: Lauréat.Puissance.StatutChangementPuissance.demandé.statut,
      autoritéCompétente,
      miseÀJourLe: demandéLe,
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
