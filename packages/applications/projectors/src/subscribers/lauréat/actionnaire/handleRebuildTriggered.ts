import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Actionnaire } from '@potentiel-domain/laureat';
import { Where } from '@potentiel-domain/entity';
import { listProjection } from '@potentiel-infrastructure/pg-projections';

import { removeProjection } from '../../../infrastructure';

export const handleRebuilTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${id}`);

  const demandeChangementActionnaire =
    await listProjection<Actionnaire.ChangementActionnaireEntity>(`changement-actionnaire`, {
      where: { identifiantProjet: Where.equal(id) },
    });

  for (const changement of demandeChangementActionnaire.items) {
    await removeProjection<Actionnaire.ChangementActionnaireEntity>(
      `changement-actionnaire|${id}#${changement.demande.demandéeLe}`,
    );
  }
};
