import type { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const numéroIdentificationCorrigéProjector = async ({
  payload: { identifiantProjet, numéroIdentification, corrigéLe },
}: Lauréat.Producteur.NuméroIdentificationCorrigéEvent) => {
  await updateOneProjection<Lauréat.Producteur.ProducteurEntity>(
    `producteur|${identifiantProjet}`,
    {
      identifiantProjet,
      miseÀJourLe: corrigéLe,
      numéroIdentification,
    },
  );
};
