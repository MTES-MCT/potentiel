import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const actionnaireImportéProjector = async ({
  payload: { identifiantProjet, actionnaire, importéLe },
}: Lauréat.Actionnaire.ActionnaireImportéEvent) =>
  await upsertProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      identifiantProjet,
      actionnaire: {
        nom: actionnaire,
        miseÀJourLe: importéLe,
      },
    },
  );
