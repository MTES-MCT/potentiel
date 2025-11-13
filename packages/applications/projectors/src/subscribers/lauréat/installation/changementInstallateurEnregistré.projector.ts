import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

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
  await updateOneProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
    {
      installateur,
      miseÀJourLe: enregistréLe,
      identifiantProjet,
    },
  );

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
