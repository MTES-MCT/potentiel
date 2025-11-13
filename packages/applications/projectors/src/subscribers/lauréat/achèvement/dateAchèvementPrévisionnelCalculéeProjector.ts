import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const dateAchèvementPrévisionnelCalculéeProjector = async ({
  payload,
}: Lauréat.Achèvement.DateAchèvementPrévisionnelCalculéeEvent) => {
  if (payload.raison === 'notification' || payload.raison === 'inconnue') {
    await upsertProjection<Lauréat.Achèvement.AchèvementEntity>(
      `achèvement|${payload.identifiantProjet}`,
      {
        identifiantProjet: payload.identifiantProjet,
        prévisionnel: {
          date: payload.date,
        },
        estAchevé: false,
      },
    );
    return;
  }

  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${payload.identifiantProjet}`,
    {
      prévisionnel: {
        date: payload.date,
      },
    },
  );
};
