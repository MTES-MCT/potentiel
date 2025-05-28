import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const abandonAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.Abandon.AbandonAnnuléEvent) => {
  await removeProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`);
};
