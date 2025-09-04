import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { ImporterOptions } from './importer/importerInstallateur.option';
import { InstallateurImportéEvent } from './importer/importerInstallateur.event';
import { InstallateurEvent } from './installateur.event';
import { InstallateurDéjàTransmisError } from './installateur.error';

export class InstallateurAggregate extends AbstractAggregate<
  InstallateurEvent,
  'installateur',
  LauréatAggregate
> {
  installateur!: string;

  get lauréat() {
    return this.parent;
  }

  async importer({
    identifiantProjet,
    installateur,
    dateImport,
    identifiantUtilisateur,
  }: ImporterOptions) {
    if (this.installateur) {
      throw new InstallateurDéjàTransmisError();
    }

    const event: InstallateurImportéEvent = {
      type: 'InstallateurImporté-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        installateur,
        importéLe: dateImport.formatter(),
        importéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  apply(event: InstallateurEvent): void {
    match(event)
      .with(
        {
          type: 'InstallateurImporté-V1',
        },
        (event) => this.applyInstallateurImportéV1(event),
      )
      .exhaustive();
  }

  private applyInstallateurImportéV1({ payload: { installateur } }: InstallateurImportéEvent) {
    this.installateur = installateur;
  }
}
