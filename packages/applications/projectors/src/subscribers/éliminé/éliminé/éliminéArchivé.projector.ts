import { Éliminé } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const éliminéArchivéProjector = async (event: Éliminé.ÉliminéArchivéEvent) => {
  await removeProjection<Éliminé.ÉliminéEntity>(`éliminé|${event.payload.identifiantProjet}`);
};
