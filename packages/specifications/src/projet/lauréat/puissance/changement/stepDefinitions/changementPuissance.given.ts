import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../../potentiel.world.js';

import {
  demanderChangementPuissance,
  accorderChangementPuissance,
  annulerChangementPuissance,
  rejeterChangementPuissance,
} from './changementPuissance.when.js';

EtantDonné(
  'une demande de changement de puissance pour le projet lauréat avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    try {
      await demanderChangementPuissance.call(this, Number(exemple['ratio puissance']));
    } catch (error) {
      this.error = error as Error;
    }
  },
);

EtantDonné(
  'une demande de changement de puissance accordée pour le projet lauréat avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    try {
      await demanderChangementPuissance.call(this, Number(exemple['ratio puissance']));
      await accorderChangementPuissance.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
EtantDonné(
  'une demande de changement de puissance rejetée pour le projet lauréat',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    try {
      await demanderChangementPuissance.call(this, Number(exemple['ratio puissance']));
      await rejeterChangementPuissance.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

EtantDonné(
  'une demande de changement de puissance annulée pour le projet lauréat',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    try {
      await demanderChangementPuissance.call(this, Number(exemple['ratio puissance']));
      await annulerChangementPuissance.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
