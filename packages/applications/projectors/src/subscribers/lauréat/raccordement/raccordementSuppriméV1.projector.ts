import { Raccordement } from '@potentiel-domain/projet';
import { Raccordement as RaccordementLauréat } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const raccordementSuppriméV1Projector = async ({
  payload: { identifiantProjet },
}: RaccordementLauréat.RaccordementSuppriméEvent) => {
  const raccordement = await findProjection<Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
  );

  if (Option.isSome(raccordement)) {
    const référencesDossiers = raccordement.dossiers.map((d) => d.référence);

    for (const référence of référencesDossiers) {
      await removeProjection<Raccordement.DossierRaccordementEntity>(
        `dossier-raccordement|${identifiantProjet}#${référence}`,
      );
    }
    await removeProjection<Raccordement.RaccordementEntity>(`raccordement|${identifiantProjet}`);
  }
};
