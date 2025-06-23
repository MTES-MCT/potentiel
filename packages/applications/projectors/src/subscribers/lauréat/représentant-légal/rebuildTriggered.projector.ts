import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Where } from '@potentiel-domain/entity';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const rebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${id}`,
  );

  const changements =
    await listProjection<Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity>(
      'changement-représentant-légal',
      {
        where: { identifiantProjet: Where.equal(id) },
      },
    );

  await Promise.all(
    changements.items.map((changement) =>
      removeProjection<Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity>(
        `changement-représentant-légal|${id}#${changement.demande.demandéLe}`,
      ),
    ),
  );

  // Suppression des anciennes projections qui avaient un identifiant différent (celui du projet)
  await removeProjection<Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${id}`,
  );
};
