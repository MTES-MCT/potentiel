import { Producteur } from '@potentiel-domain/laureat';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const producteurModifiéProjector = async ({
  payload: { identifiantProjet, producteur, modifiéLe },
}: Producteur.ProducteurModifiéEvent) => {
  await upsertProjection<Producteur.ProducteurEntity>(`producteur|${identifiantProjet}`, {
    identifiantProjet,
    nom: producteur,
    misÀJourLe: modifiéLe,
  });
};
