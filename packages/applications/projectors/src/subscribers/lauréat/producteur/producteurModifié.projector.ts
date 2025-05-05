import { Producteur } from '@potentiel-domain/laureat';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const producteurModifiéProjector = async ({
  payload: { identifiantProjet, producteur, modifiéLe },
}: Producteur.ProducteurModifiéEvent) => {
  await updateOneProjection<Producteur.ProducteurEntity>(`producteur|${identifiantProjet}`, {
    identifiantProjet,
    nom: producteur,
    misÀJourLe: modifiéLe,
  });
};
