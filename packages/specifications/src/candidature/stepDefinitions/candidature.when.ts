import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';
import { notifierLauréat } from '../../projet/lauréat/stepDefinitions/lauréat.given';
import { notifierÉliminé } from '../../projet/éliminé/stepDefinitions/éliminé.given';

import { importerCandidature } from './candidature.given';

Quand(
  `le DGEC validateur importe la candidature {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    try {
      await importerCandidature.call(this, {
        nomProjet,
        statut: 'classé',
        ...this.candidatureWorld.mapExempleToFixtureValues(exemple),
      });
    } catch (e) {
      this.error = e as Error;
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
  try {
    await notifierLauréat.call(this, dateDésignation);
  } catch (error) {
    this.error = error as Error;
  }
});

Quand('le DGEC validateur notifie la candidature éliminée', async function (this: PotentielWorld) {
  const dateDésignation = DateTime.now().formatter();

  try {
    await notifierÉliminé.call(this, dateDésignation);
  } catch (error) {
    this.error = error as Error;
  }
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

  const dateDAutorisationDUrbanisme =
    changedValues.dépôt.autorisationDUrbanisme.date ??
    this.candidatureWorld.importerCandidature.dépôtValue.autorisationDUrbanisme?.date;

  const numéroDAutorisationDUrbanisme =
    changedValues.dépôt.autorisationDUrbanisme.numéro ??
    this.candidatureWorld.importerCandidature.dépôtValue.autorisationDUrbanisme?.numéro;

  const attestationConstitutionGf = {
    ...this.candidatureWorld.importerCandidature.dépôtValue.attestationConstitutionGf,
    ...changedValues.dépôt.attestationConstitutionGf,
  };

  const dispositifDeStockageValue = {
    ...this.candidatureWorld.importerCandidature.dépôtValue.dispositifDeStockage,
    ...changedValues.dépôt.dispositifDeStockage,
  };

  const typeNatureDeLExploitation =
    changedValues.dépôt.natureDeLExploitation.typeNatureDeLExploitation ??
    this.candidatureWorld.importerCandidature.dépôtValue.natureDeLExploitation
      ?.typeNatureDeLExploitation;

  const tauxPrévisionnelACI =
    changedValues.dépôt.natureDeLExploitation.tauxPrévisionnelACI ??
    this.candidatureWorld.importerCandidature.dépôtValue.natureDeLExploitation?.tauxPrévisionnelACI;

  const { identifiantProjet, dépôtValue, instructionValue, corrigéLe, corrigéPar, détailsValue } =
    this.candidatureWorld.corrigerCandidature.créer({
      identifiantProjet: {
        ...IdentifiantProjet.convertirEnValueType(
          this.candidatureWorld.importerCandidature.identifiantProjet,
        ),
        ...changedValues.identifiantProjet,
      },
      dépôtValue: {
        ...this.candidatureWorld.importerCandidature.dépôtValue,
        ...changedValues.dépôt,
        dispositifDeStockage:
          dispositifDeStockageValue.installationAvecDispositifDeStockage !== undefined
            ? (dispositifDeStockageValue as Lauréat.Installation.DispositifDeStockage.RawType)
            : undefined,
        natureDeLExploitation: typeNatureDeLExploitation
          ? { typeNatureDeLExploitation, tauxPrévisionnelACI }
          : undefined,
        localité: {
          ...this.candidatureWorld.importerCandidature.dépôtValue.localité,
          ...changedValues.dépôt.localité,
        },
        autorisationDUrbanisme:
          dateDAutorisationDUrbanisme && numéroDAutorisationDUrbanisme
            ? {
                date: dateDAutorisationDUrbanisme,
                numéro: numéroDAutorisationDUrbanisme,
              }
            : undefined,
        fournisseurs: this.candidatureWorld.importerCandidature.dépôtValue.fournisseurs,
        attestationConstitutionGf: attestationConstitutionGf.format
          ? { format: attestationConstitutionGf.format }
          : undefined,
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
        identifiantProjetValue: identifiantProjet,
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
