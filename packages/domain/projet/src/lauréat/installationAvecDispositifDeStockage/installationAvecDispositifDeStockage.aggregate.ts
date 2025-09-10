import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { ImporterInstallationAvecDispositifDeStockageOptions } from './importer/importerInstallationAvecDispositifDeStockage.option';
import { InstallationAvecDispositifDeStockageImportéEvent } from './importer/importerInstallationAvecDispositifDeStockage.event';
import { InstallationAvecDispositifDeStockageEvent } from './installationAvecDispositifDeStockage.event';
import { InstallationAvecDispositifDeStockageDéjàTransmisError } from './installationAvecDispositifDeStockage.error';
import { ModifierInstallationAvecDispositifDeStockageOptions } from './modifier/modifierInstallationAvecDispositifDeStockage.options';
import { InstallationAvecDispositifDeStockageModifiéEvent } from './modifier/modifierInstallationAvecDispositifDeStockage.event';

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
    importéLe,
    importéPar,
  }: ImporterInstallationAvecDispositifDeStockageOptions) {
    if (this.installationAvecDispositifDeStockage) {
      throw new InstallationAvecDispositifDeStockageDéjàTransmisError();
    }

    const event: InstallationAvecDispositifDeStockageImportéEvent = {
      type: 'InstallationAvecDispositifDeStockageImporté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        installationAvecDispositifDeStockage,
        importéLe: importéLe.formatter(),
        importéPar: importéPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifier({
    installationAvecDispositifDeStockage,
    modifiéLe,
    modifiéPar,
  }: ModifierInstallationAvecDispositifDeStockageOptions) {
    const event: InstallationAvecDispositifDeStockageModifiéEvent = {
      type: 'InstallationAvecDispositifDeStockageModifié-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        installationAvecDispositifDeStockage,
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
      },
    };

    await this.publish(event);
  }

  apply(event: InstallationAvecDispositifDeStockageEvent): void {
    match(event)
      .with(
        {
          type: 'InstallationAvecDispositifDeStockageImporté-V1',
        },
        (event) => this.applyInstallationAvecDispositifDeStockageImportéV1(event),
      )
      .with(
        {
          type: 'InstallationAvecDispositifDeStockageModifié-V1',
        },
        (event) => this.applyInstallationAvecDispositifDeStockageModifiéV1(event),
      )
      .exhaustive();
  }
  //@TODO : utiliser le même apply pour les 2 ?
  private applyInstallationAvecDispositifDeStockageImportéV1({
    payload: { installationAvecDispositifDeStockage },
  }: InstallationAvecDispositifDeStockageEvent) {
    this.installationAvecDispositifDeStockage = installationAvecDispositifDeStockage;
  }

  private applyInstallationAvecDispositifDeStockageModifiéV1({
    payload: { installationAvecDispositifDeStockage },
  }: InstallationAvecDispositifDeStockageEvent) {
    this.installationAvecDispositifDeStockage = installationAvecDispositifDeStockage;
  }
}
