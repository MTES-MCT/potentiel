import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';
import { TypologieDuProjet } from '../../candidature';
import { Candidature } from '../..';

import { InstallateurModifiéEvent } from '.';

import { InstallationEvent } from './installation.event';
import { ImporterOptions } from './importer/importerInstallation.option';
import {
  InstallateurIdentiqueError,
  InstallationDéjàTransmiseError,
  JeuDeTypologiesIdentiquesError,
  NouvelleTypologieDuProjetIdentiqueÀLActuelleError,
} from './installation.error';
import { InstallationImportéeEvent } from './importer/importerInstallation.event';
import { ModifierInstallateurOptions } from './installateur/modifier/modifierInstallateur.option';
import { ModifierTypologieDuProjetOptions } from './typologie-du-projet/modifier/modifierTypologieDuProjet.option';
import { TypologieDuProjetModifiéeEvent } from './typologie-du-projet/modifier/modifierTypologieDuProjet.event';

export class InstallationAggregate extends AbstractAggregate<
  InstallationEvent,
  'installation',
  LauréatAggregate
> {
  #installateur?: string;
  #typologieDuProjet!: TypologieDuProjet.ValueType[];

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async importer({ installateur, typologieDuProjet, importéLe, importéPar }: ImporterOptions) {
    if (this.exists) {
      throw new InstallationDéjàTransmiseError();
    }

    const event: InstallationImportéeEvent = {
      type: 'InstallationImportée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        installateur: installateur ?? '',
        typologieDuProjet: typologieDuProjet.map((t) => t.formatter()),
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

  async modifierTypologieDuProjet({
    typologieDuProjet,
    dateModification,
    identifiantUtilisateur,
  }: ModifierTypologieDuProjetOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    this.vérifierQueModificationTypologieDuProjetEstPossible(typologieDuProjet);

    const event: TypologieDuProjetModifiéeEvent = {
      type: 'TypologieDuProjetModifiée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        typologieDuProjet: typologieDuProjet.map((t) => t.formatter()),
        modifiéeLe: dateModification.formatter(),
        modifiéePar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  private vérifierQueModificationTypologieDuProjetEstPossible = (
    modification: Candidature.TypologieDuProjet.ValueType[],
  ) => {
    const actuel = this.#typologieDuProjet;

    if (
      actuel.length === modification.length &&
      modification.every((m) => actuel.some((a) => m.estÉgaleÀ(a)))
    ) {
      throw new NouvelleTypologieDuProjetIdentiqueÀLActuelleError();
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
          type: 'InstallateurModifié-V1',
        },
        (event) => this.applyInstallateurModifiéV1(event),
      )
      .with({ type: 'TypologieDuProjetModifiée-V1' }, (event) =>
        this.applyTypologieDuProjetModifiéeV1(event),
      )
      .exhaustive();
  }

  private applyInstallationImportéeV1({
    payload: { installateur, typologieDuProjet },
  }: InstallationImportéeEvent) {
    this.#installateur = installateur;
    this.#typologieDuProjet = typologieDuProjet.map(TypologieDuProjet.convertirEnValueType);
  }

  private applyInstallateurModifiéV1({
    payload: { installateur: nouvelInstallateur },
  }: InstallateurModifiéEvent) {
    this.#installateur = nouvelInstallateur;
  }

  private applyTypologieDuProjetModifiéeV1({
    payload: { typologieDuProjet: nouvelleTypologieDuProjet },
  }: TypologieDuProjetModifiéeEvent) {
    this.#typologieDuProjet = nouvelleTypologieDuProjet.map(TypologieDuProjet.convertirEnValueType);
  }
}
