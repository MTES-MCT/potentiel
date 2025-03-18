import { Abandon } from '@potentiel-domain/laureat';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const abandonAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Abandon.AbandonAnnuléEvent) => {
  await removeProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`);
};
