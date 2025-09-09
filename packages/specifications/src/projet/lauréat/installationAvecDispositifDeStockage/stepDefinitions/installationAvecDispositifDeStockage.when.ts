import { DataTable, When as Quand } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  `un admin modifie l'information concernant l'installation avec dispositif de stockage du projet {lauréat-éliminé} avec :`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé', dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    const installationAvecDispositifDeStockage =
      exemple['installation avec dispositif de stockage'];

    try {
      await modifierInstallationAvecDispositifDeStockage.call(
        this,
        this.utilisateurWorld.adminFixture.email,
        statutProjet,
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
  statutProjet?: 'lauréat' | 'éliminé',
  installationAvecDispositifDeStockageExample?: string,
) {
  const { identifiantProjet } = statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

  const installationAvecDispositifDeStockage =
    installationAvecDispositifDeStockageExample === 'oui'
      ? true
      : installationAvecDispositifDeStockageExample === 'non'
        ? false
        : undefined;

  // get fixture
  const { installationAvecDispositifDeStockage: installationAvecDispositifDeStockageFixture } =
    this.lauréatWorld.installationAvecDispositifDeStockageWorld.modifierInstallationAvecDispositifDeStockageFixture.créer(
      { installationAvecDispositifDeStockage },
    );

  console.log('fixture', identifiantProjet, installationAvecDispositifDeStockageFixture);
  // call useCase
}
