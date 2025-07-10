import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const dateAchèvementPrévisionnelCalculéeProjector = async ({
  payload,
}: Lauréat.Achèvement.DateAchèvementPrévisionnelCalculéeEvent) => {
  await upsertProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${payload.identifiantProjet}`,
    {
      identifiantProjet: payload.identifiantProjet,
      dateAchèvementPrévisionnel: payload.date,
    },
  );
};
