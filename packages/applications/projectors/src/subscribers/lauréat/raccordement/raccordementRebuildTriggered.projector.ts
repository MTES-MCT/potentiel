import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Lauréat } from '@potentiel-domain/projet';
import { Where } from '@potentiel-domain/entity';

export const raccordementRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await removeProjection<Lauréat.Raccordement.RaccordementEntity>(`raccordement|${id}`);

  const dossiers = await listProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement`,
    {
      where: { identifiantProjet: Where.equal(id) },
    },
  );

  for (const { référence } of dossiers.items) {
    await removeProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
      `dossier-raccordement|${id}#${référence}`,
    );
  }
};
