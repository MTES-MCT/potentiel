import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { ImporterOptions } from './importer/importerInstallateur.option';
import { InstallateurImportéEvent } from './importer/importerInstallateur.event';
import { InstallateurEvent } from './installateur.event';
import { InstallateurDéjàTransmisError, InstallateurIdentiqueError } from './installateur.error';
import { InstallateurModifiéEvent } from './modifier/modifierInstallateur.event';
import { ModifierOptions } from './modifier/modifierInstallateur.option';

export class InstallateurAggregate extends AbstractAggregate<
  InstallateurEvent,
  'installateur',
  LauréatAggregate
> {
  installateur!: string;

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async importer({ installateur, importéLe, importéPar }: ImporterOptions) {
    if (this.installateur) {
      throw new InstallateurDéjàTransmisError();
    }

    const event: InstallateurImportéEvent = {
      type: 'InstallateurImporté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        installateur,
        importéLe: importéLe.formatter(),
        importéPar: importéPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifier({
    identifiantProjet,
    installateur,
    dateModification,
    identifiantUtilisateur,
  }: ModifierOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (this.installateur === installateur) {
      throw new InstallateurIdentiqueError();
    }

    const event: InstallateurModifiéEvent = {
      type: 'InstallateurModifié-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        installateur,
        modifiéLe: dateModification.formatter(),
        modifiéPar: identifiantUtilisateur.formatter(),
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
      .with(
        {
          type: 'InstallateurModifié-V1',
        },
        (event) => this.applyInstallateurModifiéV1(event),
      )
      .exhaustive();
  }

  private applyInstallateurImportéV1({ payload: { installateur } }: InstallateurImportéEvent) {
    this.installateur = installateur;
  }

  private applyInstallateurModifiéV1({
    payload: { installateur: nouvelInstallateur },
  }: InstallateurModifiéEvent) {
    this.installateur = nouvelInstallateur;
  }
}
