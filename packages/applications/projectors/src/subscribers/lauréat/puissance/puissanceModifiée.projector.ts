import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const puissanceModifiéeProjector = async ({
  payload: { identifiantProjet, modifiéeLe, puissance, puissanceDeSite },
}: Lauréat.Puissance.PuissanceModifiéeEvent) => {
  await updateOneProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    puissance,
    miseÀJourLe: modifiéeLe,
    ...(puissanceDeSite !== undefined
      ? {
          puissanceDeSite,
        }
      : {}),
  });
};
