import { IdentifiantProjet } from '@potentiel-domain/common';
import { Puissance } from '@potentiel-domain/laureat';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const puissanceImportéeProjector = async ({
  payload: { identifiantProjet, puissance, importéeLe },
}: Puissance.PuissanceImportéeEvent) => {
  const { appelOffre } = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  await upsertProjection<Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    appelOffre,
    identifiantProjet,
    puissance,
    miseÀJourLe: importéeLe,
  });
};
