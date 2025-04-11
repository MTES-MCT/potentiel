import { Puissance } from '@potentiel-domain/laureat';
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
}: Puissance.ChangementPuissanceEnregistréEvent) => {
  await updateOneProjection<Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    puissance,
    miseÀJourLe: enregistréLe,
  });

  await upsertProjection<Puissance.ChangementPuissanceEntity>(
    `changement-puissance|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      demande: {
        nouvellePuissance: puissance,
        statut: Puissance.StatutChangementPuissance.informationEnregistrée.statut,
        demandéePar: enregistréPar,
        demandéeLe: enregistréLe,
        raison,
        pièceJustificative,
      },
    },
  );
};
