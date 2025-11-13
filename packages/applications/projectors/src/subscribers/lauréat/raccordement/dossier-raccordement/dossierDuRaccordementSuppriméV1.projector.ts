import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const dossierDuRaccordementSuppriméV1Projector = async ({
  payload: { identifiantProjet, référenceDossier },
}: Lauréat.Raccordement.DossierDuRaccordementSuppriméEvent) => {
  await removeProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossier}`,
  );
};
