import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const producteurModifiéProjector = async ({
  payload: { identifiantProjet, producteur, modifiéLe },
}: Lauréat.Producteur.ProducteurModifiéEvent) => {
  await updateOneProjection<Lauréat.Producteur.ProducteurEntity>(
    `producteur|${identifiantProjet}`,
    {
      identifiantProjet,
      nom: producteur,
      misÀJourLe: modifiéLe,
    },
  );
};
