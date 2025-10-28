import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const producteurModifiéProjector = async ({
  payload: { identifiantProjet, producteur, modifiéLe },
}: Lauréat.Producteur.ProducteurModifiéEvent) => {
  await upsertProjection<Lauréat.Producteur.ProducteurEntity>(`producteur|${identifiantProjet}`, {
    identifiantProjet,
    nom: producteur,
    miseÀJourLe: modifiéLe,
  });
};
