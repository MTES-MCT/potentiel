import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { Candidature } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

import { PotentielWorld } from '../../potentiel.world.js';

EtantDonné(
  `la candidature lauréate legacy {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await importerCandidaturePériodeLegacy.call(this, nomProjet, 'classé', exemple);
  },
);

EtantDonné(
  `la candidature éliminée legacy {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await importerCandidaturePériodeLegacy.call(this, nomProjet, 'éliminé', exemple);
  },
);

export async function importerCandidaturePériodeLegacy(
  this: PotentielWorld,
  nomProjet: string,
  statut: Candidature.StatutCandidature.RawType,
  exemple: Record<string, string>,
) {
  const fixturesValues = this.candidatureWorld.mapExempleToFixtureValues(exemple);
  const { dépôtValue, instructionValue, identifiantProjet, importéLe, importéPar } =
    this.candidatureWorld.importerCandidature.créer({
      ...fixturesValues,
      dépôt: {
        ...fixturesValues.dépôt,
        nomProjet: fixturesValues.dépôt?.nomProjet ?? nomProjet,
      },
      instruction: {
        ...fixturesValues.instruction,
        statut,
      },
      importéPar: this.utilisateurWorld.validateurFixture.email,
    });

  const event: Candidature.CandidatureImportéeEvent = {
    type: 'CandidatureImportée-V2',
    payload: {
      identifiantProjet,
      importéLe: DateTime.convertirEnValueType(importéLe).formatter(),
      importéPar,
      ...Candidature.Dépôt.convertirEnValueType(dépôtValue).formatter(),
      ...Candidature.Instruction.convertirEnValueType(instructionValue).formatter(),
    },
  };

  await publish(`candidature|${identifiantProjet}`, event);
}
