import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';
import { notifierLauréat } from '../../projet/lauréat/stepDefinitions/lauréat.given';

Quand(
  `le DGEC validateur importe la candidature {string} avec :`,
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
  'le DGEC validateur corrige la candidature avec :',
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    await corrigerCandidature.call(this, exemple);
  },
);

Quand(
  'le DGEC validateur corrige la candidature sans modification',
  async function (this: PotentielWorld) {
    await corrigerCandidature.call(this);
  },
);

Quand('le DGEC validateur notifie la candidature lauréate', async function (this: PotentielWorld) {
  const dateDésignation = DateTime.now().formatter();
  await notifierLauréat.call(this, dateDésignation);
});

Quand(
  'le DGEC validateur notifie la candidature lauréate le {string}',
  async function (this: PotentielWorld, dateNotification: string) {
    const dateDésignation = DateTime.convertirEnValueType(
      new Date(dateNotification).toISOString(),
    ).formatter();

    await notifierLauréat.call(this, dateDésignation);
  },
);

export async function corrigerCandidature(this: PotentielWorld, exemple?: Record<string, string>) {
  const unchangedValues = this.candidatureWorld.importerCandidature.values;
  const changedValues = {
    ...this.candidatureWorld.mapExempleToFixtureValues(exemple ?? {}),
    détailsValue: exemple?.détails ? JSON.parse(exemple.détails) : undefined,
  };
  const newValues = {
    ...unchangedValues,
    ...changedValues,
  };

  const { values } = this.candidatureWorld.corrigerCandidature.créer({
    identifiantProjet: this.candidatureWorld.importerCandidature.identifiantProjet,
    values: {
      ...newValues,
      localitéValue: {
        ...unchangedValues.localitéValue,
        ...changedValues.localitéValue,
      },

      doitRégénérerAttestation: newValues.doitRégénérerAttestation || undefined,
      corrigéLe: DateTime.now().formatter(),
      corrigéPar: this.utilisateurWorld.validateurFixture.email,
    },
  });

  try {
    await mediator.send<Candidature.CorrigerCandidatureUseCase>({
      type: 'Candidature.UseCase.CorrigerCandidature',
      data: values,
    });
  } catch (error) {
    this.error = error as Error;
  }
}
