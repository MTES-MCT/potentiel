import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../../potentiel.world';

import { soumettreDépôt } from './dépôtGarantiesFinancières.when';

EtantDonné(
  'un dépôt de garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    await soumettreDépôt.call(
      this,
      this.lauréatWorld.identifiantProjet,
      this.lauréatWorld.garantiesFinancièresWorld.dépôt.mapExempleToUseCaseData(exemple),
    );
  },
);

EtantDonné(
  'un dépôt de garanties financières pour le projet {string}',
  async function (this: PotentielWorld, _: string) {
    await soumettreDépôt.call(this, this.lauréatWorld.identifiantProjet, {});
  },
);
