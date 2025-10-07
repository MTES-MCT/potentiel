import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { InstallationEvent } from './installation.event';
import { ImporterOptions } from './importer/importerInstallation.option';
import { InstallationDéjàTransmiseError } from './installation.error';
import { InstallationImportéeEvent } from './importer/importerInstalltion.event';
import { ModifierInstallateurOptions } from './installateur/modifier/modifierInstallateur.option';
import { InstallateurIdentiqueError } from './installateur/installateur.error';
import { InstallateurModifiéEvent } from './installateur';

export class InstallationAggregate extends AbstractAggregate<
  InstallationEvent,
  'installation',
  LauréatAggregate
> {
  installateur!: string | undefined;

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async importer({ installateur, importéLe, importéPar }: ImporterOptions) {
    if (this.installateur) {
      throw new InstallationDéjàTransmiseError();
    }

    const event: InstallationImportéeEvent = {
      type: 'InstallationImportée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        installateur,
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

    if (this.installateur === installateur) {
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
      .exhaustive();
  }

  private applyInstallationImportéeV1({ payload: { installateur } }: InstallationImportéeEvent) {
    this.installateur = installateur;
  }

  private applyInstallateurModifiéV1({
    payload: { installateur: nouvelInstallateur },
  }: InstallateurModifiéEvent) {
    this.installateur = nouvelInstallateur;
  }
}
