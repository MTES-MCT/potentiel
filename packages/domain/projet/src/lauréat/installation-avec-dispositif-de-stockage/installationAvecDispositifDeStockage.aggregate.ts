import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { DispositifDeStockage, InstallationAvecDispositifDeStockageEvent } from '.';

import { ImporterInstallationAvecDispositifDeStockageOptions } from './importer/importerInstallationAvecDispositifDeStockage.option';
import { InstallationAvecDispositifDeStockageImportéeEvent } from './importer/importerInstallationAvecDispositifDeStockage.event';
import { ModifierInstallationAvecDispositifDeStockageOptions } from './modifier/modifierInstallationAvecDispositifDeStockage.options';
import { InstallationAvecDispositifDeStockageModifiéeEvent } from './modifier/modifierInstallationAvecDispositifDeStockage.event';
import {
  InstallationAvecDispositifDeStockageDéjàTransmiseError,
  InstallationAvecDispositifDeStockageIdentiqueError,
} from './installationAvecDispositifDeStockage.error';

export class InstallationAvecDispositifDeStockageAggregate extends AbstractAggregate<
  InstallationAvecDispositifDeStockageEvent,
  'installation-avec-dispositif-de-stockage',
  LauréatAggregate
> {
  dispositifDeStockage!: DispositifDeStockage.ValueType;

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async importer({
    dispositifDeStockage,
    importéeLe,
    importéePar,
  }: ImporterInstallationAvecDispositifDeStockageOptions) {
    if (this.dispositifDeStockage) {
      throw new InstallationAvecDispositifDeStockageDéjàTransmiseError();
    }

    const event: InstallationAvecDispositifDeStockageImportéeEvent = {
      type: 'InstallationAvecDispositifDeStockageImportée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dispositifDeStockage,
        importéeLe: importéeLe.formatter(),
        importéePar: importéePar.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifier({
    dispositifDeStockage,
    modifiéeLe,
    modifiéePar,
  }: ModifierInstallationAvecDispositifDeStockageOptions) {
    if (dispositifDeStockage.estÉgaleÀ(this.dispositifDeStockage)) {
      throw new InstallationAvecDispositifDeStockageIdentiqueError();
    }

    const event: InstallationAvecDispositifDeStockageModifiéeEvent = {
      type: 'InstallationAvecDispositifDeStockageModifiée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dispositifDeStockage,
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
    payload: { dispositifDeStockage },
  }: InstallationAvecDispositifDeStockageEvent) {
    this.dispositifDeStockage = DispositifDeStockage.bind(dispositifDeStockage);
  }

  private applyInstallationAvecDispositifDeStockageModifiéeV1({
    payload: { dispositifDeStockage },
  }: InstallationAvecDispositifDeStockageEvent) {
    this.dispositifDeStockage = DispositifDeStockage.bind(dispositifDeStockage);
  }
}
