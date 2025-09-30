import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';
import { mapToExemple } from '../../../../helpers/mapToExemple';
import { DispositifDeStockageExempleMap } from '../fixture/dispositifDeStockageExempleMap';

Quand(
  `un admin modifie l'information concernant l'installation avec dispositif de stockage du projet lauréat avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const dispositifDeStockage = mapToExemple(exemple, DispositifDeStockageExempleMap);

    try {
      await modifierInstallationAvecDispositifDeStockage.call(
        this,
        this.utilisateurWorld.adminFixture.email,
        dispositifDeStockage,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

async function modifierInstallationAvecDispositifDeStockage(
  this: PotentielWorld,
  modifiéPar: string,
  dispositifDeStockageExemple: Lauréat.InstallationAvecDispositifDeStockage.DispositifDeStockage.RawType,
) {
  const { identifiantProjet } = this.lauréatWorld;

  const {
    installationAvecDispositifDeStockage: installationAvecDispositifDeStockageFixture,
    dateModification,
  } =
    this.lauréatWorld.installationAvecDispositifDeStockageWorld.modifierInstallationAvecDispositifDeStockageFixture.créer(
      { installationAvecDispositifDeStockage },
    );

  await mediator.send<Lauréat.InstallationAvecDispositifDeStockage.ModifierInstallationAvecDispositifDeStockageUseCase>(
    {
      type: 'Lauréat.InstallationAvecDispositifDeStockage.UseCase.ModifierInstallationAvecDispositifDeStockage',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        installationAvecDispositifDeStockageValue: installationAvecDispositifDeStockageFixture,
        modifiéeLeValue: dateModification,
        modifiéeParValue: modifiéPar,
      },
    },
  );
}
