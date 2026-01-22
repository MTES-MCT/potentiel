import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../../potentiel.world.js';

import { soumettreDépôt } from './dépôtGarantiesFinancières.when.js';

EtantDonné(
  'un dépôt de garanties financières avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    await soumettreDépôt.call(
      this,
      this.lauréatWorld.identifiantProjet,
      this.lauréatWorld.garantiesFinancièresWorld.dépôt.mapExempleToUseCaseData(exemple),
    );
  },
);

EtantDonné('un dépôt de garanties financières', async function (this: PotentielWorld) {
  await soumettreDépôt.call(this, this.lauréatWorld.identifiantProjet, {});
});
