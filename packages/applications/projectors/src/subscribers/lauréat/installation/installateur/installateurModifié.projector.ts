import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const installateurModifiéProjector = async ({
  payload: { identifiantProjet, installateur, modifiéLe },
}: Lauréat.Installation.InstallateurModifiéEvent) => {
  const installationActuelle = await findProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
  );

  if (!installationActuelle) {
    // Pour ce champs "supplémentaire", la modification peut être une initialisation de la valeur
    await upsertProjection<Lauréat.Installation.InstallationEntity>(
      `installation|${identifiantProjet}`,
      {
        installateur,
        miseÀJourLe: modifiéLe,
        identifiantProjet,
      },
    );
  } else {
    await updateOneProjection<Lauréat.Installation.InstallationEntity>(
      `installation|${identifiantProjet}`,
      {
        installateur,
        miseÀJourLe: modifiéLe,
        identifiantProjet,
      },
    );
  }
};
