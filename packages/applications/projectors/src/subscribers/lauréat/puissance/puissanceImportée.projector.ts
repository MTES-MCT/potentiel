import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const puissanceImportéeProjector = async ({
  payload: { identifiantProjet, puissance, puissanceDeSite, importéeLe },
}: Lauréat.Puissance.PuissanceImportéeEvent) => {
  await upsertProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    identifiantProjet,
    puissance,
    puissanceDeSite,
    miseÀJourLe: importéeLe,
  });
};
