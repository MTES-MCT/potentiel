import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';

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
