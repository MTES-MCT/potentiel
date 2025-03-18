import { Actionnaire } from '@potentiel-domain/laureat';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const actionnaireImportéProjector = async ({
  payload: { identifiantProjet, actionnaire, importéLe },
}: Actionnaire.ActionnaireImportéEvent) =>
  await upsertProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    identifiantProjet,
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: importéLe,
    },
  });
