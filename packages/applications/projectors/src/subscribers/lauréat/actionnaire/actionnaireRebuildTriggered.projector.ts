import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Actionnaire } from '@potentiel-domain/laureat';
import { Where } from '@potentiel-domain/entity';

export const actionnaireRebuilTriggered = async ({ payload: { id } }: RebuildTriggered) => {
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
