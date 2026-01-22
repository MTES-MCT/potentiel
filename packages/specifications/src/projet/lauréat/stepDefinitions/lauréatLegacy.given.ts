import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../potentiel.world.js';
import { importerCandidaturePériodeLegacy } from '../../../candidature/stepDefinitions/candidatureLegacy.given.js';

import { notifierLauréat } from './lauréat.given.js';

EtantDonné(
  'le projet lauréat legacy {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();

    await importerCandidaturePériodeLegacy.call(this, nomProjet, 'classé', exemple);

    await notifierLauréat.call(this);
  },
);
