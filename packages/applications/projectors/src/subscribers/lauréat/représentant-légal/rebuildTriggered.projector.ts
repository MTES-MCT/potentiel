import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Where } from '@potentiel-domain/entity';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const rebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<ReprésentantLégal.ReprésentantLégalEntity>(`représentant-légal|${id}`);

  const changements = await listProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
    'changement-représentant-légal',
    {
      where: { identifiantProjet: Where.equal(id) },
    },
  );

  await Promise.all(
    changements.items.map((changement) =>
      removeProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
        `changement-représentant-légal|${id}#${changement.demande.demandéLe}`,
      ),
    ),
  );

  // Suppression des anciennes projections qui avaient un identifiant différent (celui du projet)
  await removeProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${id}`,
  );
};
