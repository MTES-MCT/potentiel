import { type DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { importerCandidaturePériodeLegacy } from '../../../candidature/stepDefinitions/candidatureLegacy.given';
import type { PotentielWorld } from '../../../potentiel.world';
import { notifierLauréat } from './lauréat.given';

EtantDonné(
  'le projet lauréat legacy {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();

    await importerCandidaturePériodeLegacy.call(this, nomProjet, 'classé', exemple);

    const dateDésignation = this.lauréatWorld.dateDésignation;

    await notifierLauréat.call(this, dateDésignation);
  },
);
