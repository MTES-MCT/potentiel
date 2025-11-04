import { match, P } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';
import { TypologieInstallation } from '../../candidature';
import { Candidature } from '../..';
import {
  DispositifDeStockageNonAttenduError,
  InstallateurNonAttenduError,
} from '../../candidature/candidature.error';

import {
  DispositifDeStockage,
  DispositifDeStockageModifiéEvent,
  InstallateurModifiéEvent,
} from '.';

import { InstallationEvent } from './installation.event';
import { ImporterOptions } from './importer/importerInstallation.option';
import {
  DispositifDeStockageIdentiqueError,
  InstallateurIdentiqueError,
  InstallationDéjàTransmiseError,
  JeuDeTypologiesIdentiquesError,
  NouvelleTypologieInstallationIdentiqueÀLActuelleError,
} from './installation.error';
import { InstallationImportéeEvent } from './importer/importerInstallation.event';
import { ModifierInstallateurOptions } from './installateur/modifier/modifierInstallateur.option';
import { ModifierTypologieInstallationOptions } from './typologie-installation/modifier/modifierTypologieInstallation.option';
import { TypologieInstallationModifiéeEvent } from './typologie-installation/modifier/modifierTypologieInstallation.event';
import { ModifierDispositifDeStockageOptions } from './dispositif-de-stockage/modifier/modifierDispositifDeStockage.options';
import { EnregistrerChangementInstallateurOptions } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.option';
import { ChangementInstallateurEnregistréEvent } from './installateur/changement/enregistrerChangement/enregistrerChangementInstallateur.event';

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
      },
    };

    await this.publish(event);
  }

  async modifierTypologieInstallation({
    typologieInstallation,
    dateModification,
    identifiantUtilisateur,
  }: ModifierTypologieInstallationOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    this.vérifierQueModificationTypologieInstallationEstPossible(typologieInstallation);

    const event: TypologieInstallationModifiéeEvent = {
      type: 'TypologieInstallationModifiée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        typologieInstallation: typologieInstallation.map((t) => t.formatter()),
        modifiéeLe: dateModification.formatter(),
        modifiéePar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifierDispositifDeStockage({
    dispositifDeStockage,
    modifiéLe,
    modifiéPar,
  }: ModifierDispositifDeStockageOptions) {
    const { dispositifDeStockage: champsSupplémentairedispositifDeStockage } =
      this.lauréat.parent.cahierDesChargesActuel.getChampsSupplémentaires();

    if (!champsSupplémentairedispositifDeStockage) {
      throw new DispositifDeStockageNonAttenduError();
    }

    if (this.#dispositifDeStockage && dispositifDeStockage.estÉgaleÀ(this.#dispositifDeStockage)) {
      throw new DispositifDeStockageIdentiqueError();
    }

    const event: DispositifDeStockageModifiéEvent = {
      type: 'DispositifDeStockageModifié-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dispositifDeStockage: dispositifDeStockage.formatter(),
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
      },
    };
    await this.publish(event);
  }

  async enregistrerChangementInstallateur({
    identifiantProjet,
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
        identifiantProjet: identifiantProjet.formatter(),
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
      .with({ type: 'DispositifDeStockageModifié-V1' }, (event) =>
        this.applyDispositifDeStockageModifiéV1(event),
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

  private applyDispositifDeStockageModifiéV1({
    payload: { dispositifDeStockage },
  }: DispositifDeStockageModifiéEvent) {
    this.#dispositifDeStockage = DispositifDeStockage.convertirEnValueType(dispositifDeStockage);
  }
}
