import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { Where } from '@potentiel-domain/entity';

import { rebuildProjection } from '../../../helpers';

export const fournisseurrebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await rebuildProjection<Lauréat.Fournisseur.FournisseurEntity>('fournisseur', id);

  await removeProjectionWhere<Lauréat.Fournisseur.ChangementFournisseurEntity>(
    'changement-fournisseur',
    { identifiantProjet: Where.equal(id) },
  );
};
