import type { Lauréat } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const raccordementRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  const raccordement = await findProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${id}`,
  );

  if (Option.isSome(raccordement)) {
    for (const référence of raccordement.dossiers.map((d) => d.référence)) {
      await removeProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
        `dossier-raccordement|${id}#${référence}`,
      );
    }

    await removeProjection<Lauréat.Raccordement.RaccordementEntity>(`raccordement|${id}`);
  }
};
