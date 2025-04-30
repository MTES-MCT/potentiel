import { Producteur } from '@potentiel-domain/laureat';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const producteurImportéProjector = async ({
  payload: { identifiantProjet, producteur, importéLe },
}: Producteur.ProducteurImportéEvent) => {
  await upsertProjection<Producteur.ProducteurEntity>(`producteur|${identifiantProjet}`, {
    identifiantProjet,
    nom: producteur,
    misÀJourLe: importéLe,
  });
};
