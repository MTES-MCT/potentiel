import { Abandon } from '@potentiel-domain/laureat';

import { removeProjection } from '../../../infrastructure';

export const abandonAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Abandon.AbandonAnnuléEvent) => {
  await removeProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`);
};
