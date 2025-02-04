import { Lauréat } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../infrastructure';

export const lauréatNotifiéProjector = async ({
  payload: { identifiantProjet, notifiéLe, notifiéPar, nomProjet, localité },
}: Lauréat.LauréatNotifiéEvent) =>
  await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    identifiantProjet,
    notifiéLe,
    notifiéPar,
    nomProjet,
    localité,
  });
