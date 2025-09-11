import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  `un admin modifie l'information concernant l'installation avec dispositif de stockage du projet lauréat avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    const installationAvecDispositifDeStockage =
      exemple['installation avec dispositif de stockage'];

    try {
      await modifierInstallationAvecDispositifDeStockage.call(
        this,
        this.utilisateurWorld.adminFixture.email,
        installationAvecDispositifDeStockage,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

async function modifierInstallationAvecDispositifDeStockage(
  this: PotentielWorld,
  modifiéPar: string,
  installationAvecDispositifDeStockageExample?: string,
) {
  const { identifiantProjet } = this.lauréatWorld;

  const installationAvecDispositifDeStockage =
    installationAvecDispositifDeStockageExample === 'oui'
      ? true
      : installationAvecDispositifDeStockageExample === 'non'
        ? false
        : undefined;

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
