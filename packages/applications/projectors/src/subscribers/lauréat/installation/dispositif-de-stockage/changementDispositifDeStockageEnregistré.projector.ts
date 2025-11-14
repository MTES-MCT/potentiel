import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

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
  await updateOneProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
    {
      dispositifDeStockage: dispositifDeStockage.installationAvecDispositifDeStockage
        ? dispositifDeStockage
        : {
            installationAvecDispositifDeStockage: false,
            capacitéDuDispositifDeStockageEnKWh: undefined,
            puissanceDuDispositifDeStockageEnKW: undefined,
          },
      miseÀJourLe: enregistréLe,
      identifiantProjet,
    },
  );

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
