import { Éliminé } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';
import { Where } from '@potentiel-domain/entity';

import { clearProjection } from '../../../helpers/index.js';

export const recoursRebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjectionWhere<Éliminé.Recours.DemandeRecoursEntity>('demande-recours', {
    identifiantProjet: Where.equal(id),
  });
  await clearProjection<Éliminé.Recours.RecoursEntity>('recours', id);
};
