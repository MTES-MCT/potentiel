import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { ImporterInstallationAvecDispositifDeStockageOptions } from './importer/importerInstallationAvecDispositifDeStockage.option';
import { InstallationAvecDispositifDeStockageImportéEvent } from './importer/importerInstallationAvecDispositifDeStockage.event';
import { InstallationAvecDispositifDeStockageEvent } from './installationAvecDispositifDeStockage.event';
import { InstallationAvecDispositifDeStockageDéjàTransmisError } from './installationAvecDispositifDeStockage.error';

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

  apply(event: InstallationAvecDispositifDeStockageEvent): void {
    match(event)
      .with(
        {
          type: 'InstallationAvecDispositifDeStockageImporté-V1',
        },
        (event) => this.applyInstallationAvecDispositifDeStockageImportéV1(event),
      )
      .exhaustive();
  }

  private applyInstallationAvecDispositifDeStockageImportéV1({
    payload: { installationAvecDispositifDeStockage },
  }: InstallationAvecDispositifDeStockageEvent) {
    this.installationAvecDispositifDeStockage = installationAvecDispositifDeStockage;
  }
}
