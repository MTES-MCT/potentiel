import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const raccordementSuppriméV1Projector = async ({
  payload: { identifiantProjet },
}: Lauréat.Raccordement.RaccordementSuppriméEvent) => {
  await removeProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
  );

  const dossiers = await listProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement`,
    {
      where: { identifiantProjet: Where.equal(identifiantProjet) },
    },
  );

  for (const { référence } of dossiers.items) {
    await removeProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
      `dossier-raccordement|${identifiantProjet}#${référence}`,
    );
  }
};
