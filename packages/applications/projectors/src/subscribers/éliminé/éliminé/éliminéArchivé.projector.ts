import { Éliminé } from '@potentiel-domain/elimine';

import { removeProjection } from '../../../infrastructure/removeProjection';

export const éliminéArchivéProjector = async (event: Éliminé.ÉliminéArchivéEvent) => {
  await removeProjection<Éliminé.ÉliminéEntity>(`éliminé|${event.payload.identifiantProjet}`);
};
