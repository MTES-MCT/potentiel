import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { ImporterInstallationAvecDispositifDeStockageOptions } from './importer/importerInstallationAvecDispositifDeStockage.option';
import { InstallationAvecDispositifDeStockageImportéeEvent } from './importer/importerInstallationAvecDispositifDeStockage.event';
import { InstallationAvecDispositifDeStockageEvent } from './installationAvecDispositifDeStockage.event';
import {
  InstallationAvecDispositifDeStockageDéjàTransmiseError,
  InstallationAvecDispositifDeStockageIdentiqueError,
} from './installationAvecDispositifDeStockage.error';
import { ModifierInstallationAvecDispositifDeStockageOptions } from './modifier/modifierInstallationAvecDispositifDeStockage.options';
import { InstallationAvecDispositifDeStockageModifiéeEvent } from './modifier/modifierInstallationAvecDispositifDeStockage.event';

export class InstallationAvecDispositifDeStockageAggregate extends AbstractAggregate<
  InstallationAvecDispositifDeStockageEvent,
  'installation-avec-dispositif-de-stockage',
  LauréatAggregate
> {
  installationAvecDispositifDeStockage!: boolean;

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async importer({
    installationAvecDispositifDeStockage,
    importéeLe,
    importéePar,
  }: ImporterInstallationAvecDispositifDeStockageOptions) {
    if (this.installationAvecDispositifDeStockage) {
      throw new InstallationAvecDispositifDeStockageDéjàTransmiseError();
    }

    const event: InstallationAvecDispositifDeStockageImportéeEvent = {
      type: 'InstallationAvecDispositifDeStockageImportée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        installationAvecDispositifDeStockage,
        importéeLe: importéeLe.formatter(),
        importéePar: importéePar.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifier({
    installationAvecDispositifDeStockage,
    modifiéeLe,
    modifiéePar,
  }: ModifierInstallationAvecDispositifDeStockageOptions) {
    if (installationAvecDispositifDeStockage === this.installationAvecDispositifDeStockage) {
      throw new InstallationAvecDispositifDeStockageIdentiqueError();
    }

    const event: InstallationAvecDispositifDeStockageModifiéeEvent = {
      type: 'InstallationAvecDispositifDeStockageModifiée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        installationAvecDispositifDeStockage,
        modifiéeLe: modifiéeLe.formatter(),
        modifiéePar: modifiéePar.formatter(),
      },
    };

    await this.publish(event);
  }

  apply(event: InstallationAvecDispositifDeStockageEvent): void {
    match(event)
      .with(
        {
          type: 'InstallationAvecDispositifDeStockageImportée-V1',
        },
        (event) => this.applyInstallationAvecDispositifDeStockageImportéeV1(event),
      )
      .with(
        {
          type: 'InstallationAvecDispositifDeStockageModifiée-V1',
        },
        (event) => this.applyInstallationAvecDispositifDeStockageModifiéeV1(event),
      )
      .exhaustive();
  }

  private applyInstallationAvecDispositifDeStockageImportéeV1({
    payload: { installationAvecDispositifDeStockage },
  }: InstallationAvecDispositifDeStockageEvent) {
    this.installationAvecDispositifDeStockage = installationAvecDispositifDeStockage;
  }

  private applyInstallationAvecDispositifDeStockageModifiéeV1({
    payload: { installationAvecDispositifDeStockage },
  }: InstallationAvecDispositifDeStockageEvent) {
    this.installationAvecDispositifDeStockage = installationAvecDispositifDeStockage;
  }
}
