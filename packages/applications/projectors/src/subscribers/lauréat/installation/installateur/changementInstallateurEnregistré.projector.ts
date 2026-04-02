import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';

export const changementInstallateurEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    enregistréLe,
    installateur,
    enregistréPar,
    raison,
    pièceJustificative,
  },
}: Lauréat.Installation.ChangementInstallateurEnregistréEvent) => {
  const installationActuelle = await findProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
  );

  const payload = {
    installateur,
    miseÀJourLe: enregistréLe,
    identifiantProjet,
  };

  if (!installationActuelle) {
    // Pour ce champs "supplémentaire", la modification peut être une initialisation de la valeur
    await upsertProjection<Lauréat.Installation.InstallationEntity>(
      `installation|${identifiantProjet}`,
      payload,
    );
  } else {
    await updateOneProjection<Lauréat.Installation.InstallationEntity>(
      `installation|${identifiantProjet}`,
      payload,
    );
  }

  await upsertProjection<Lauréat.Installation.ChangementInstallateurEntity>(
    `changement-installateur|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      changement: {
        enregistréPar,
        enregistréLe,
        raison,
        pièceJustificative,
        installateur,
      },
    },
  );
};
