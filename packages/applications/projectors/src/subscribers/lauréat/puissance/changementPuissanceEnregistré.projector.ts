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
    enregistréPar,
    raison,
    pièceJustificative,
  },
}: Lauréat.Puissance.ChangementPuissanceEnregistréEvent) => {
  await updateOneProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    puissance,
    miseÀJourLe: enregistréLe,
  });

  await upsertProjection<Lauréat.Puissance.ChangementPuissanceEntity>(
    `changement-puissance|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      misÀJourLe: enregistréLe,
      demande: {
        nouvellePuissance: puissance,
        statut: Lauréat.Puissance.StatutChangementPuissance.informationEnregistrée.statut,
        demandéePar: enregistréPar,
        demandéeLe: enregistréLe,
        raison,
        pièceJustificative,
      },
    },
  );
};
