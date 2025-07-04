import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const raccordementSuppriméV1Projector = async ({
  payload: { identifiantProjet },
}: Lauréat.Raccordement.RaccordementSuppriméEvent) => {
  const raccordement = await findProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
  );

  if (Option.isSome(raccordement)) {
    const référencesDossiers = raccordement.dossiers.map((d) => d.référence);

    for (const référence of référencesDossiers) {
      await removeProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
        `dossier-raccordement|${identifiantProjet}#${référence}`,
      );
    }
    await removeProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
    );
  }
};
