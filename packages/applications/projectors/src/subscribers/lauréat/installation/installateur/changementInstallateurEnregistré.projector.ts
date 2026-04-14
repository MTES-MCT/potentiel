import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

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

  await upsertProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
    {
      // Pour ce champ supplémentaire, la modification peut être une initialisation de la valeur
      ...(Option.isSome(installationActuelle) ? installationActuelle : {}),
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
