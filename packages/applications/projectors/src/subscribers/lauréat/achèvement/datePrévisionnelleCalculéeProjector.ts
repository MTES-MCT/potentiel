import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const datePrévisionnelleCalculéeProjector = async ({
  payload,
}: Lauréat.Achèvement.DatePrévisionnelleCalculéeEvent) => {
  await upsertProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${payload.identifiantProjet}`,
    {
      identifiantProjet: payload.identifiantProjet,
      datePrévisionnelle: payload.date,
    },
  );
};
