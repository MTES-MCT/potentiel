import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';

export const actionnaireRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Lauréat.Actionnaire.ActionnaireEntity>(`actionnaire|${id}`);

  const demandeChangementActionnaire =
    await listProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
      `changement-actionnaire`,
      {
        where: { identifiantProjet: Where.equal(id) },
      },
    );

  for (const changement of demandeChangementActionnaire.items) {
    await removeProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
      `changement-actionnaire|${id}#${changement.demande.demandéeLe}`,
    );
  }
};
