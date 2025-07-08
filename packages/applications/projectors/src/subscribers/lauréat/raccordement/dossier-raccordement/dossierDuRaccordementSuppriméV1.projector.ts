import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const dossierDuRaccordementSuppriméV1Projector = async ({
  payload: { identifiantProjet, référenceDossier },
}: Lauréat.Raccordement.DossierDuRaccordementSuppriméEvent) => {
  const raccordement = await findProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
  );

  if (Option.isSome(raccordement)) {
    const dossiersMisÀJour = raccordement.dossiers.filter(
      (dossier) => dossier.référence !== référenceDossier,
    );

    await upsertProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      {
        ...raccordement,
        dossiers: dossiersMisÀJour,
      },
    );
    await removeProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
      `dossier-raccordement|${identifiantProjet}#${référenceDossier}`,
    );
  }
};
