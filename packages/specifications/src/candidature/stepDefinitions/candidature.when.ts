import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';
import { notifierLauréat } from '../../projet/lauréat/stepDefinitions/lauréat.given';

import { importerCandidature } from './candidature.given';

Quand(
  `le DGEC validateur importe la candidature {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const { dépôt, instruction } = this.candidatureWorld.mapExempleToFixtureValues(exemple);
    await importerCandidature.call(this, nomProjet, 'classé', dépôt, instruction);
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
  const changedValues = this.candidatureWorld.mapExempleToFixtureValues(exemple ?? {});

  const identifiantProjet = IdentifiantProjet.convertirEnValueType(
    this.candidatureWorld.importerCandidature.identifiantProjet,
  );
  const { dépôtValue, instructionValue, corrigéLe, corrigéPar, détailsValue } =
    this.candidatureWorld.corrigerCandidature.créer({
      identifiantProjet: identifiantProjet.formatter(),
      dépôtValue: {
        ...this.candidatureWorld.importerCandidature.dépôtValue,
        ...changedValues.dépôt,
        localité: {
          ...this.candidatureWorld.importerCandidature.dépôtValue.localité,
          ...changedValues.dépôt.localité,
        },
        fournisseurs: this.candidatureWorld.importerCandidature.dépôtValue.fournisseurs,
      },
      instructionValue: {
        ...this.candidatureWorld.importerCandidature.instructionValue,
        ...changedValues.instruction,
      },

      détailsValue: exemple?.détails ? JSON.parse(exemple.détails) : undefined,
      corrigéLe: DateTime.now().formatter(),
      corrigéPar: this.utilisateurWorld.validateurFixture.email,
    });

  try {
    await mediator.send<Candidature.CorrigerCandidatureUseCase>({
      type: 'Candidature.UseCase.CorrigerCandidature',
      data: {
        appelOffreValue: identifiantProjet.appelOffre,
        périodeValue: identifiantProjet.période,
        familleValue: identifiantProjet.famille,
        numéroCREValue: identifiantProjet.numéroCRE,
        dépôtValue,
        instructionValue,
        corrigéLe,
        corrigéPar,
        détailsValue,
        doitRégénérerAttestation:
          exemple?.['doit régénérer attestation'] === 'oui' ? true : undefined,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
