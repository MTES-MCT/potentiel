import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';

Quand(
  `un administrateur importe la candidature {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    if (!this.candidatureWorld.importerCandidature.aÉtéCréé) {
      this.candidatureWorld.importerCandidature.créer({
        values: {
          ...this.candidatureWorld.mapExempleToFixtureValues(exemple),
          statutValue: exemple['statut'] === 'classé' ? 'classé' : 'éliminé',
          nomProjetValue: nomProjet,
          importéPar: this.utilisateurWorld.validateurFixture.email,
        },
      });
    }
    const { values } = this.candidatureWorld.importerCandidature;

    try {
      await mediator.send<Candidature.ImporterCandidatureUseCase>({
        type: 'Candidature.UseCase.ImporterCandidature',
        data: values,
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'un administrateur corrige la candidature avec :',
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    await corrigerCandidature.call(this, exemple);
  },
);

Quand(
  'un administrateur corrige la candidature sans modification',
  async function (this: PotentielWorld) {
    await corrigerCandidature.call(this);
  },
);

async function corrigerCandidature(this: PotentielWorld, exemple?: Record<string, string>) {
  const { values } = this.candidatureWorld.importerCandidature.créer({
    identifiantProjet: this.candidatureWorld.importerCandidature.identifiantProjet,
    values: {
      ...this.candidatureWorld.importerCandidature.values,
      ...this.candidatureWorld.mapExempleToFixtureValues(exemple ?? {}),
      importéPar: this.utilisateurWorld.validateurFixture.email,
      statutValue: this.candidatureWorld.importerCandidature.values.statutValue,
      nomProjetValue: this.candidatureWorld.importerCandidature.values.nomProjetValue,
    },
  });

  const { corrigéLe, corrigéPar } = this.candidatureWorld.corrigerCandidature.créer({
    corrigéLe: DateTime.now().formatter(),
    corrigéPar: this.utilisateurWorld.validateurFixture.email,
  });

  const doitRégénérerAttestation =
    exemple?.['doit régénérer attestation'] === 'oui' ? true : undefined;

  try {
    await mediator.send<Candidature.CorrigerCandidatureUseCase>({
      type: 'Candidature.UseCase.CorrigerCandidature',
      data: {
        ...values,
        corrigéLe,
        corrigéPar,
        doitRégénérerAttestation,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
