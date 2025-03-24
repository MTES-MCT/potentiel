import { Puissance } from '@potentiel-domain/laureat';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const puissanceImportéeProjector = async ({
  payload: { identifiantProjet, puissance, importéeLe },
}: Puissance.PuissanceImportéeEvent) =>
  await upsertProjection<Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    identifiantProjet,
    puissance: {
      valeur: puissance,
      miseÀJourLe: importéeLe,
    },
  });
