import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';
import { TypologieInstallation } from '../../candidature';
import { Candidature } from '../..';

import { InstallateurModifiéEvent } from '.';

import { InstallationEvent } from './installation.event';
import { ImporterOptions } from './importer/importerInstallation.option';
import {
  InstallateurIdentiqueError,
  InstallationDéjàTransmiseError,
  TypologieInstallationIdentiqueError,
} from './installation.error';
import { InstallationImportéeEvent } from './importer/importerInstallation.event';
import { ModifierInstallateurOptions } from './installateur/modifier/modifierInstallateur.option';
import { ModifierTypologieInstallationOptions } from './typologie-installation/modifier/modifierTypologieInstallation.option';
import { TypologieInstallationModifiéeEvent } from './typologie-installation/modifier/modifierTypologieInstallation.event';

export class InstallationAggregate extends AbstractAggregate<
  InstallationEvent,
  'installation',
  LauréatAggregate
> {
  #installateur?: string;
  #typologieInstallation!: TypologieInstallation.ValueType[];

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async importer({ installateur, typologieInstallation, importéLe, importéPar }: ImporterOptions) {
    if (this.exists) {
      throw new InstallationDéjàTransmiseError();
    }

    const event: InstallationImportéeEvent = {
      type: 'InstallationImportée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        installateur: installateur ?? '',
        typologieInstallation,
        importéLe: importéLe.formatter(),
        importéPar: importéPar.formatter(),
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

  async modifierTypologieInstallation({
    typologieInstallation,
    dateModification,
    identifiantUtilisateur,
  }: ModifierTypologieInstallationOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    this.vérifierModificationTypologieInstallation(typologieInstallation);

    const event: TypologieInstallationModifiéeEvent = {
      type: 'TypologieInstallationModifiée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        typologieInstallation: typologieInstallation.map(
          TypologieInstallation.convertirEnValueType,
        ),
        modifiéeLe: dateModification.formatter(),
        modifiéePar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  private vérifierModificationTypologieInstallation = (
    modification: Candidature.TypologieInstallation.ValueType[],
  ) => {
    if (modification.length !== this.#typologieInstallation.length) return;

    modification.every((item, index) => {
      const actuel = this.#typologieInstallation[index];
      if (item.estÉgaleÀ(actuel)) {
        throw new TypologieInstallationIdentiqueError();
      }
    });
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
      .with({ type: 'TypologieInstallationModifiée-V1' }, (event) =>
        this.applyTypologieInstallationModifiéeV1(event),
      )
      .exhaustive();
  }

  private applyInstallationImportéeV1({
    payload: { installateur, typologieInstallation },
  }: InstallationImportéeEvent) {
    this.#installateur = installateur;
    this.#typologieInstallation = typologieInstallation.map(
      TypologieInstallation.convertirEnValueType,
    );
  }

  private applyInstallateurModifiéV1({
    payload: { installateur: nouvelInstallateur },
  }: InstallateurModifiéEvent) {
    this.#installateur = nouvelInstallateur;
  }

  private applyTypologieInstallationModifiéeV1({
    payload: { typologieInstallation: nouvelleTypologieInstallation },
  }: TypologieInstallationModifiéeEvent) {
    this.#typologieInstallation = nouvelleTypologieInstallation.map(
      TypologieInstallation.convertirEnValueType,
    );
  }
}
