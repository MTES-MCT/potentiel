import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';
import { mapToExemple } from '../../../../helpers/mapToExemple';
import { dispositifDeStockageExempleMap } from '../../../../candidature/candidature.exempleMap';
import { ModifierDispositifDeStockage } from '../fixture/modifierDispositifDeStockage.fixture';

Quand(
  `un admin modifie le dispositif de stockage du projet lauréat avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const dispositifDeStockage = mapToExemple(exemple, dispositifDeStockageExempleMap);

    try {
      await modifierDispositifDeStockage.call(
        this,
        this.utilisateurWorld.adminFixture.email,
        dispositifDeStockage,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

async function modifierDispositifDeStockage(
  this: PotentielWorld,
  modifiéPar: string,
  dispositifDeStockageExemple: Partial<ModifierDispositifDeStockage['dispositifDeStockage']>,
) {
  const { identifiantProjet } = this.lauréatWorld;

  const { dispositifDeStockage, dateModification } =
    this.lauréatWorld.dispositifDeStockageWorld.modifierDispositifDeStockageFixture.créer({
      dispositifDeStockage:
        dispositifDeStockageExemple.installationAvecDispositifDeStockage !== undefined
          ? {
              // otherwise typescript does not understand that dispositifDeStockageExemple.installationAvecDispositifDeStockage is not undefined...
              installationAvecDispositifDeStockage:
                dispositifDeStockageExemple.installationAvecDispositifDeStockage,
              ...dispositifDeStockageExemple,
            }
          : undefined,
    });

  await mediator.send<Lauréat.InstallationAvecDispositifDeStockage.ModifierInstallationAvecDispositifDeStockageUseCase>(
    {
      type: 'Lauréat.InstallationAvecDispositifDeStockage.UseCase.ModifierInstallationAvecDispositifDeStockage',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        dispositifDeStockageValue: dispositifDeStockage,
        modifiéeLeValue: dateModification,
        modifiéeParValue: modifiéPar,
      },
    },
  );
}
