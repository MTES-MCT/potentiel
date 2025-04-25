import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../potentiel.world';
import { importerCandidatureLegacy } from '../../../candidature/stepDefinitions/candidatureLegacy.given';

import { insérerProjetAvecDonnéesCandidature, notifierLauréat } from './lauréat.given';

EtantDonné(
  'le projet lauréat legacy {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();

    await importerCandidatureLegacy.call(
      this,
      nomProjet,
      'classé',
      this.candidatureWorld.mapExempleToFixtureValues(exemple),
    );

    const dateDésignation = this.lauréatWorld.dateDésignation;

    await notifierLauréat.call(this, dateDésignation);

    await insérerProjetAvecDonnéesCandidature.call(this, dateDésignation, 'lauréat');
  },
);
