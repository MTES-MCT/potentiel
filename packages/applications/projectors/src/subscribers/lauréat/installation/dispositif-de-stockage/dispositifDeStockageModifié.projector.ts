import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const dispositifDeStockageModifiéProjector = async ({
  payload: { identifiantProjet, modifiéLe, dispositifDeStockage },
}: Lauréat.Installation.DispositifDeStockageModifiéEvent) => {
  const installationActuelle = await findProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
  );

  await upsertProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
    {
      // Pour ce champ supplémentaire, la modification peut être une initialisation de la valeur
      ...(Option.isSome(installationActuelle) ? installationActuelle : {}),
      dispositifDeStockage: dispositifDeStockage.installationAvecDispositifDeStockage
        ? dispositifDeStockage
        : {
            installationAvecDispositifDeStockage: false,
            capacitéDuDispositifDeStockageEnKWh: undefined,
            puissanceDuDispositifDeStockageEnKW: undefined,
          },
      miseÀJourLe: modifiéLe,
      identifiantProjet,
    },
  );
};
