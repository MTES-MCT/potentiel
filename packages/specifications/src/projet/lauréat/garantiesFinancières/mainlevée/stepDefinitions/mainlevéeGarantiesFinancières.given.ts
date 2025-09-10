import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../../potentiel.world';

import {
  accorderMainlevée,
  demanderMainlevée,
  démarrerInstructionMainlevée,
  rejeterMainlevée,
} from './mainlevéeGarantiesFinancières.when';

EtantDonné(
  'une demande de mainlevée de garanties financières',
  async function (this: PotentielWorld) {
    await demanderMainlevée.call(this);
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    await demanderMainlevée.call(
      this,
      this.lauréatWorld.garantiesFinancièresWorld.mainlevée.mapToExemple(exemple),
    );
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières en instruction',
  async function (this: PotentielWorld) {
    await demanderMainlevée.call(this);
    await démarrerInstructionMainlevée.call(this);
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières accordée',
  async function (this: PotentielWorld) {
    await demanderMainlevée.call(this);
    await accorderMainlevée.call(this);
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières rejetée',
  async function (this: PotentielWorld) {
    await demanderMainlevée.call(this);
    await rejeterMainlevée.call(this);
  },
);
