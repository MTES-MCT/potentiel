import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Raccordement } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const raccordementRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  const raccordement = await findProjection<Raccordement.RaccordementEntity>(`raccordement|${id}`);

  if (Option.isSome(raccordement)) {
    for (const référence of raccordement.dossiers.map((d) => d.référence)) {
      await removeProjection<Raccordement.DossierRaccordementEntity>(
        `dossier-raccordement|${id}#${référence}`,
      );
    }

    await removeProjection<Raccordement.RaccordementEntity>(`raccordement|${id}`);
  }
};
