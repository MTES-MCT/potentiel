import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const rebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Lauréat.LauréatEntity>(`lauréat|${id}`);

  const demandesChangement = await listProjection<Lauréat.ChangementNomProjetEntity>(
    'changement-nom-projet',
    {
      where: { identifiantProjet: Where.equal(id) },
    },
  );

  for (const changement of demandesChangement.items) {
    await removeProjection<Lauréat.ChangementNomProjetEntity>(
      `changement-nom-projet|${id}#${changement.changement.enregistréLe}`,
    );
  }
};
