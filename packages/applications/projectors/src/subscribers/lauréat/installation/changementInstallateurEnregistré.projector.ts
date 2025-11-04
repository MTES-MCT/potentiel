import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

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
  const installation = await findProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
  );

  if (Option.isNone(installation)) {
    getLogger().error(`Installation non trouvée`, {
      identifiantProjet,
      fonction: 'changementInstallateurEnregistréProjector',
    });
    return;
  }

  await upsertProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
    {
      ...installation,
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
        ancienInstallateur: installation.installateur,
        nouvelInstallateur: installateur,
      },
    },
  );
};
