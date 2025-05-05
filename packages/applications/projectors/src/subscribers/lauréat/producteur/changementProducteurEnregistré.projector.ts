import { Producteur } from '@potentiel-domain/laureat';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementProducteurEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    enregistréLe,
    producteur,
    enregistréPar,
    raison,
    pièceJustificative,
  },
}: Producteur.ChangementProducteurEnregistréEvent) => {
  await updateOneProjection<Producteur.ProducteurEntity>(`producteur|${identifiantProjet}`, {
    nom: producteur,
    misÀJourLe: enregistréLe,
  });

  await upsertProjection<Producteur.ChangementProducteurEntity>(
    `changement-producteur|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      changement: {
        nouveauProducteur: producteur,
        enregistréPar,
        enregistréLe,
        raison,
        pièceJustificative,
      },
    },
  );
};
