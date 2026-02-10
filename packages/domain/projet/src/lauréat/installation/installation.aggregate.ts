import { match, P } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate.js';
import { TypologieInstallation } from '../../candidature/index.js';
import { Candidature, Lauréat } from '../../index.js';
import {
  DispositifDeStockageNonAttenduError,
  InstallateurNonAttenduError,
  TypologieInstallationNonAttendueError,
} from '../../candidature/candidature.error.js';

import {
  ChangementInstallateurEnregistréEvent,
  DispositifDeStockage,
  DispositifDeStockageModifiéEvent,
  InstallateurModifiéEvent,
} from './index.js';

import { InstallationEvent } from './installation.event.js';
import { ImporterOptions } from './importer/importerInstallation.option.js';
import {
  DispositifDeStockageIdentiqueError,
  InstallateurIdentiqueError,
  InstallationDéjàTransmiseError,
  JeuDeTypologiesIdentiquesError,
  NouvelleTypologieInstallationIdentiqueÀLActuelleError,
} from './installation.error.js';
import { InstallationImportéeEvent } from './importer/importerInstallation.event.js';
import { ModifierInstallateurOptions } from './installateur/modifier/modifierInstallateur.option.js';
import { ModifierTypologieInstallationOptions } from './typologie-installation/modifier/modifierTypologieInstallation.option.js';
import { TypologieInstallationModifiéeEvent } from './typologie-installation/modifier/modifierTypologieInstallation.event.js';
import { ModifierDispositifDeStockageOptions } from './dispositif-de-stockage/modifier/modifierDispositifDeStockage.options.js';
import { EnregistrerChangementInstallateurOptions } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.option.js';
import { ChangementDispositifDeStockageEnregistréEvent } from './dispositif-de-stockage/changement/enregistrer/enregistrerChangementDispositifDeStockage.event.js';
import { EnregistrerChangementDispositifDeStockageOptions } from './dispositif-de-stockage/changement/enregistrer/enregistrerChangementDispositifDeStockage.options.js';

export class InstallationAggregate extends AbstractAggregate<
  InstallationEvent,
  'installation',
  LauréatAggregate
> {
  #installateur?: string;
  #typologieInstallation!: TypologieInstallation.ValueType[];
  #dispositifDeStockage?: DispositifDeStockage.ValueType;

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async importer({
    installateur,
    typologieInstallation,
    dispositifDeStockage,
    importéLe,
    importéPar,
  }: ImporterOptions) {
    if (this.exists) {
      throw new InstallationDéjàTransmiseError();
    }

    const event: InstallationImportéeEvent = {
      type: 'InstallationImportée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        installateur: installateur ?? '',
        typologieInstallation: typologieInstallation.map((t) => t.formatter()),
        dispositifDeStockage: dispositifDeStockage?.formatter(),

        importéeLe: importéLe.formatter(),
        importéePar: importéPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifierInstallateur({
    installateur,
    dateModification,
    identifiantUtilisateur,
    raison,
    pièceJustificative,
  }: ModifierInstallateurOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    const { installateur: champsSupplémentaireInstallateur } =
      this.lauréat.parent.cahierDesChargesActuel.getChampsSupplémentaires();

    if (!champsSupplémentaireInstallateur) {
      throw new InstallateurNonAttenduError();
    }

    if (this.#installateur === installateur) {
      throw new InstallateurIdentiqueError();
    }

    const event: InstallateurModifiéEvent = {
      type: 'InstallateurModifié-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        installateur,
        modifiéLe: dateModification.formatter(),
        modifiéPar: identifiantUtilisateur.formatter(),
        raison,
        pièceJustificative,
      },
    };

    await this.publish(event);
  }

  async modifierTypologieInstallation({
    typologieInstallation,
    dateModification,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
  }: ModifierTypologieInstallationOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    const { typologieInstallation: champsSupplémentaireTypologieInstallation } =
      this.lauréat.parent.cahierDesChargesActuel.getChampsSupplémentaires();

    if (!champsSupplémentaireTypologieInstallation) {
      throw new TypologieInstallationNonAttendueError();
    }

    this.vérifierQueModificationTypologieInstallationEstPossible(typologieInstallation);

    const event: TypologieInstallationModifiéeEvent = {
      type: 'TypologieInstallationModifiée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        typologieInstallation: typologieInstallation.map((t) => t.formatter()),
        modifiéeLe: dateModification.formatter(),
        modifiéePar: identifiantUtilisateur.formatter(),
        raison,
        pièceJustificative,
      },
    };

    await this.publish(event);
  }

  async modifierDispositifDeStockage({
    dispositifDeStockage,
    modifiéLe,
    modifiéPar,
    raison,
    pièceJustificative,
  }: ModifierDispositifDeStockageOptions) {
    this.vérifierSiMiseÀJourDispositifDeStockagePossible(dispositifDeStockage);

    const event: DispositifDeStockageModifiéEvent = {
      type: 'DispositifDeStockageModifié-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dispositifDeStockage: dispositifDeStockage.formatter(),
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
        raison,
        pièceJustificative,
      },
    };
    await this.publish(event);
  }

  async enregistrerChangementDispositifDeStockage({
    dispositifDeStockage,
    enregistréLe,
    enregistréPar,
    pièceJustificative,
    raison,
  }: EnregistrerChangementDispositifDeStockageOptions) {
    this.lauréat.vérifierQueLeChangementEstPossible(
      'information-enregistrée',
      'dispositifDeStockage',
    );

    this.vérifierSiMiseÀJourDispositifDeStockagePossible(dispositifDeStockage);

    const event: ChangementDispositifDeStockageEnregistréEvent = {
      type: 'ChangementDispositifDeStockageEnregistré-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dispositifDeStockage: dispositifDeStockage.formatter(),
        enregistréLe: enregistréLe.formatter(),
        enregistréPar: enregistréPar.formatter(),
        raison,
        pièceJustificative,
      },
    };

    await this.publish(event);
  }

  async enregistrerChangementInstallateur({
    installateur,
    dateChangement,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
  }: EnregistrerChangementInstallateurOptions) {
    this.lauréat.vérifierQueLeChangementEstPossible('information-enregistrée', 'installateur');
    if (this.#installateur === installateur) {
      throw new InstallateurIdentiqueError();
    }

    const event: ChangementInstallateurEnregistréEvent = {
      type: 'ChangementInstallateurEnregistré-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        installateur,
        enregistréLe: dateChangement.formatter(),
        enregistréPar: identifiantUtilisateur.formatter(),
        raison,
        pièceJustificative,
      },
    };

    await this.publish(event);
  }

  private vérifierQueModificationTypologieInstallationEstPossible = (
    modification: Candidature.TypologieInstallation.ValueType[],
  ) => {
    const actuel = this.#typologieInstallation;

    if (
      actuel.length === modification.length &&
      modification.every((m) => actuel.some((a) => m.estÉgaleÀ(a)))
    ) {
      throw new NouvelleTypologieInstallationIdentiqueÀLActuelleError();
    }

    if (modification.length > 1) {
      const uniqueTypologies = new Set(modification.map((m) => m.typologie));
      if (uniqueTypologies.size < modification.length) {
        throw new JeuDeTypologiesIdentiquesError();
      }
    }
  };

  private vérifierSiMiseÀJourDispositifDeStockagePossible = (
    modification: Lauréat.Installation.DispositifDeStockage.ValueType,
  ) => {
    const { dispositifDeStockage: champsSupplémentairedispositifDeStockage } =
      this.lauréat.parent.cahierDesChargesActuel.getChampsSupplémentaires();

    if (!champsSupplémentairedispositifDeStockage) {
      throw new DispositifDeStockageNonAttenduError();
    }

    if (this.#dispositifDeStockage && modification.estÉgaleÀ(this.#dispositifDeStockage)) {
      throw new DispositifDeStockageIdentiqueError();
    }
  };

  apply(event: InstallationEvent): void {
    match(event)
      .with(
        {
          type: 'InstallationImportée-V1',
        },
        (event) => this.applyInstallationImportéeV1(event),
      )
      .with(
        {
          type: P.union('InstallateurModifié-V1', 'ChangementInstallateurEnregistré-V1'),
        },
        (event) => this.applyInstallateurModifiéV1(event),
      )
      .with({ type: 'TypologieInstallationModifiée-V1' }, (event) =>
        this.applyTypologieInstallationModifiéeV1(event),
      )
      .with(
        {
          type: P.union(
            'DispositifDeStockageModifié-V1',
            'ChangementDispositifDeStockageEnregistré-V1',
          ),
        },
        (event) => this.applyDispositifDeStockageMisÀJourV1(event),
      )
      .exhaustive();
  }

  private applyInstallationImportéeV1({
    payload: { installateur, typologieInstallation, dispositifDeStockage },
  }: InstallationImportéeEvent) {
    this.#installateur = installateur;
    this.#typologieInstallation = typologieInstallation.map(
      TypologieInstallation.convertirEnValueType,
    );
    this.#dispositifDeStockage =
      dispositifDeStockage && DispositifDeStockage.convertirEnValueType(dispositifDeStockage);
  }

  private applyInstallateurModifiéV1({
    payload: { installateur: nouvelInstallateur },
  }: InstallateurModifiéEvent | ChangementInstallateurEnregistréEvent) {
    this.#installateur = nouvelInstallateur;
  }

  private applyTypologieInstallationModifiéeV1({
    payload: { typologieInstallation: nouvelleTypologieInstallation },
  }: TypologieInstallationModifiéeEvent) {
    this.#typologieInstallation = nouvelleTypologieInstallation.map(
      TypologieInstallation.convertirEnValueType,
    );
  }

  private applyDispositifDeStockageMisÀJourV1({
    payload: { dispositifDeStockage },
  }: DispositifDeStockageModifiéEvent | ChangementDispositifDeStockageEnregistréEvent) {
    this.#dispositifDeStockage = DispositifDeStockage.convertirEnValueType(dispositifDeStockage);
  }
}
