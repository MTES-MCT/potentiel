import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { Where } from '@potentiel-domain/entity';

import { clearProjection } from '../../../helpers';

export const fournisseurRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await clearProjection<Lauréat.Fournisseur.FournisseurEntity>('fournisseur', id);

  await removeProjectionWhere<Lauréat.Fournisseur.ChangementFournisseurEntity>(
    'changement-fournisseur',
    { identifiantProjet: Where.equal(id) },
  );
};
