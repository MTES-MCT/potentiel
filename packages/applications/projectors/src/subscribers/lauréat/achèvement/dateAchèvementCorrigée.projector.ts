import type { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const dateAchèvementCorrigéeProjector = async ({
  payload,
}: Lauréat.Achèvement.DateAchèvementCorrigéeEvent) => {
  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${payload.identifiantProjet}`,
    {
      réel: {
        date: payload.dateAchèvement,
        dernièreMiseÀJour: {
          date: payload.corrigéeLe,
          utilisateur: payload.corrigéePar,
        },
      },
    },
  );
};
