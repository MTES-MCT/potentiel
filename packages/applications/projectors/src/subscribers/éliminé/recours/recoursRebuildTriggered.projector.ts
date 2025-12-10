import { Éliminé } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { clearProjection } from '../../../helpers';

export const recoursRebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await clearProjection<Éliminé.Recours.RecoursEntity>(`demande-recours`, id);
};
