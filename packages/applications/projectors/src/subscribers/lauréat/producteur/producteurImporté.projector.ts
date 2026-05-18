import type { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const producteurImportéProjector = async ({
  payload: { identifiantProjet, producteur, importéLe, numéroIdentification },
}: Lauréat.Producteur.ProducteurImportéEvent) => {
  await upsertProjection<Lauréat.Producteur.ProducteurEntity>(`producteur|${identifiantProjet}`, {
    identifiantProjet,
    nom: producteur,
    miseÀJourLe: importéLe,
    numéroIdentification,
  });
};
