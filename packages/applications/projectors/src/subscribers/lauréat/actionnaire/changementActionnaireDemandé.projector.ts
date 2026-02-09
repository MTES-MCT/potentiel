import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

export const changementActionnaireDemandéProjector = async ({
  payload: {
    actionnaire,
    identifiantProjet,
    demandéLe,
    demandéPar,
    raison,
    pièceJustificative: { format },
  },
}: Lauréat.Actionnaire.ChangementActionnaireDemandéEvent) => {
  await updateOneProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      aUneDemandeEnCours: true,
      dateDernièreDemande: demandéLe,
    },
  );

  await upsertProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${demandéLe}`,
    {
      identifiantProjet,
      miseÀJourLe: demandéLe,
      demande: {
        statut: Lauréat.Actionnaire.StatutChangementActionnaire.demandé.statut,
        nouvelActionnaire: actionnaire,
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
