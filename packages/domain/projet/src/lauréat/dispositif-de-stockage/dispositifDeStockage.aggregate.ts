import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { DispositifDeStockage, DispositifDeStockageEvent } from '.';

import { ImporterDispositifDeStockageOptions } from './importer/importerDispositifDeStockage.option';
import { DispositifDeStockageImportéEvent } from './importer/importerDispositifDeStockage.event';
import { ModifierDispositifDeStockageOptions } from './modifier/modifierDispositifDeStockage.options';
import { DispositifDeStockageModifiéEvent } from './modifier/modifierDispositifDeStockage.event';
import {
  DispositifDeStockageDéjàTransmiseError,
  DispositifDeStockageIdentiqueError,
} from './dispositifDeStockage.error';

export class DispositifDeStockageAggregate extends AbstractAggregate<
  DispositifDeStockageEvent,
  'dispositif-de-stockage',
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
    importéLe,
    importéPar,
  }: ImporterDispositifDeStockageOptions) {
    if (this.dispositifDeStockage) {
      throw new DispositifDeStockageDéjàTransmiseError();
    }

    const event: DispositifDeStockageImportéEvent = {
      type: 'DispositifDeStockageImporté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dispositifDeStockage,
        importéLe: importéLe.formatter(),
        importéPar: importéPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifier({
    dispositifDeStockage,
    modifiéLe,
    modifiéPar,
  }: ModifierDispositifDeStockageOptions) {
    if (dispositifDeStockage.estÉgaleÀ(this.dispositifDeStockage)) {
      throw new DispositifDeStockageIdentiqueError();
    }

    const event: DispositifDeStockageModifiéEvent = {
      type: 'DispositifDeStockageModifié-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dispositifDeStockage,
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
      },
    };

    await this.publish(event);
  }

  apply(event: DispositifDeStockageEvent): void {
    match(event)
      .with(
        {
          type: 'DispositifDeStockageImporté-V1',
        },
        (event) => this.applyDispositifDeStockageImportéV1(event),
      )
      .with(
        {
          type: 'DispositifDeStockageModifié-V1',
        },
        (event) => this.applyDispositifDeStockageModifiéV1(event),
      )
      .exhaustive();
  }

  private applyDispositifDeStockageImportéV1({
    payload: { dispositifDeStockage },
  }: DispositifDeStockageEvent) {
    this.dispositifDeStockage = DispositifDeStockage.bind(dispositifDeStockage);
  }

  private applyDispositifDeStockageModifiéV1({
    payload: { dispositifDeStockage },
  }: DispositifDeStockageEvent) {
    this.dispositifDeStockage = DispositifDeStockage.bind(dispositifDeStockage);
  }
}
