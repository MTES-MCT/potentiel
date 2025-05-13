import { Lauréat } from '@potentiel-domain/projet';
import { Abandon } from '@potentiel-domain/laureat';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const abandonAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.Abandon.AbandonAnnuléEvent) => {
  await removeProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`);
};
