import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const changementDispositifDeStockageEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    enregistréLe,
    dispositifDeStockage,
    enregistréPar,
    raison,
    pièceJustificative,
  },
}: Lauréat.Installation.ChangementDispositifDeStockageEnregistréEvent) => {
  const installationActuelle = await findProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
  );

  const payload = {
    dispositifDeStockage: dispositifDeStockage.installationAvecDispositifDeStockage
      ? dispositifDeStockage
      : {
          installationAvecDispositifDeStockage: false,
          capacitéDuDispositifDeStockageEnKWh: undefined,
          puissanceDuDispositifDeStockageEnKW: undefined,
        },
    miseÀJourLe: enregistréLe,
    identifiantProjet,
  };

  if (Option.isNone(installationActuelle)) {
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

  await upsertProjection<Lauréat.Installation.ChangementDispositifDeStockageEntity>(
    `changement-dispositif-de-stockage|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      changement: {
        enregistréPar,
        enregistréLe,
        raison,
        pièceJustificative,
        dispositifDeStockage,
      },
    },
  );
};
