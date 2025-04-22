import { Puissance } from '@potentiel-domain/laureat';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const puissanceModifiéeProjector = async ({
  payload: { identifiantProjet, modifiéeLe, puissance },
}: Puissance.PuissanceModifiéeEvent) => {
  await updateOneProjection<Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    puissance,
    miseÀJourLe: modifiéeLe,
  });
};
