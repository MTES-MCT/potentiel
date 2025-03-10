import { Éliminé } from '@potentiel-domain/elimine';

import { upsertProjection } from '../../../infrastructure';

export const éliminéNotifiéProjector = async (event: Éliminé.ÉliminéNotifiéEvent) => {
  const { identifiantProjet, notifiéLe, notifiéPar } = event.payload;
  await upsertProjection<Éliminé.ÉliminéEntity>(`éliminé|${identifiantProjet}`, {
    identifiantProjet,
    notifiéLe,
    notifiéPar,
  });
};
