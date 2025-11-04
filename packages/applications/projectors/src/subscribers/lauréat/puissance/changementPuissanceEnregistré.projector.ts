import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementPuissanceEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    enregistréLe,
    puissance,
    puissanceDeSite,
    enregistréPar,
    raison,
    pièceJustificative,
  },
}: Lauréat.Puissance.ChangementPuissanceEnregistréEvent) => {
  await updateOneProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    puissance,
    ...(puissanceDeSite !== undefined
      ? {
          puissanceDeSite,
        }
      : {}),
    miseÀJourLe: enregistréLe,
  });

  await upsertProjection<Lauréat.Puissance.ChangementPuissanceEntity>(
    `changement-puissance|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      miseÀJourLe: enregistréLe,
      demande: {
        nouvellePuissance: puissance,
        nouvellePuissanceDeSite: puissanceDeSite,
        statut: Lauréat.Puissance.StatutChangementPuissance.informationEnregistrée.statut,
        demandéePar: enregistréPar,
        demandéeLe: enregistréLe,
        raison,
        pièceJustificative,
      },
    },
  );
};
