import { Lauréat } from '@potentiel-domain/projet';
import { AbandonBen } from '@potentiel-domain/laureat';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const abandonAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.Abandon.AbandonAnnuléEvent) => {
  await removeProjection<AbandonBen.AbandonEntity>(`abandon|${identifiantProjet}`);
};
