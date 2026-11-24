import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import * as IdentifiantPériode from './identifiantPériode.valueType.js';
import type { ImporterPériodeOptions } from './importer/importerPériode.options.js';
import type { InitierImportPériodeOptions } from './importer/initierImportPériode.options.js';
import type { PériodeImportéeEvent } from './importer/périodeImportée.event.js';
import type { PériodeNotifiéeEvent } from './notifier/notifierPériode.event.js';
import type { NotifierPériodeOptions } from './notifier/notifierPériode.options.js';
import type { PériodeEvent } from './période.event.js';
import type { ImportPériodeInitiéEvent } from './période.js';

export class PériodeAggregate extends AbstractAggregate<PériodeEvent, 'période'> {
  #identifiantLauréats: ReadonlyArray<IdentifiantProjet.ValueType> = [];
  #identifiantÉliminés: ReadonlyArray<IdentifiantProjet.ValueType> = [];

  get identifiantPériode() {
    return IdentifiantPériode.convertirEnValueType(this.aggregateId.split('|')[1]);
  }

  get identifiantLauréats() {
    return this.#identifiantLauréats;
  }

  get identifiantÉliminés() {
    return this.#identifiantÉliminés;
  }

  async initierImport({ initiéLe, initiéPar, instruction }: InitierImportPériodeOptions) {
    // TODO : gérer cas où la période a déjà été importée / notifiée et on importe de nouveaux candidats
    const event: ImportPériodeInitiéEvent = {
      type: 'ImportPériodeInitié-V1',
      payload: {
        identifiantPériode: this.identifiantPériode.formatter(),
        initiéLe: initiéLe.formatter(),
        initiéPar: initiéPar.formatter(),
        instruction: instruction.map(({ identifiantProjet, ...instruction }) => ({
          identifiantProjet: identifiantProjet.formatter(),
          ...instruction.formatter(),
        })),
      },
    };

    await this.publish(event);
  }

  applyImportPériodeInitié(_: ImportPériodeInitiéEvent) {}

  async importer({
    identifiantPériode,
    importéLe,
    importéPar,
    projetsEnErreur,
  }: ImporterPériodeOptions) {
    const event: PériodeImportéeEvent = {
      type: 'PériodeImportée-V1',
      payload: {
        identifiantPériode: identifiantPériode.formatter(),
        importéLe: importéLe.formatter(),
        importéPar: importéPar.formatter(),
        projetsEnErreur: projetsEnErreur.map(({ identifiantProjet, motif }) => ({
          identifiantProjet: identifiantProjet.formatter(),
          motif,
        })),
      },
    };

    await this.publish(event);
  }

  applyPériodeImportée(_: PériodeImportéeEvent) {}

  async notifier({
    identifiantLauréats,
    identifiantÉliminés,
    notifiéeLe,
    notifiéePar,
  }: NotifierPériodeOptions) {
    const event: PériodeNotifiéeEvent = {
      type: 'PériodeNotifiée-V1',
      payload: {
        identifiantPériode: this.identifiantPériode.formatter(),
        appelOffre: this.identifiantPériode.appelOffre,
        période: this.identifiantPériode.période,
        notifiéeLe: notifiéeLe.formatter(),
        notifiéePar: notifiéePar.formatter(),
        identifiantLauréats: identifiantLauréats.map((identifiantLauréat) =>
          identifiantLauréat.formatter(),
        ),
        identifiantÉliminés: identifiantÉliminés.map((identifiantÉliminé) =>
          identifiantÉliminé.formatter(),
        ),
      },
    };

    await this.publish(event);
  }

  applyPériodeNotifiée({
    payload: { identifiantLauréats, identifiantÉliminés },
  }: PériodeNotifiéeEvent) {
    this.#identifiantLauréats = identifiantLauréats.map((identifiantLauréat) =>
      IdentifiantProjet.convertirEnValueType(identifiantLauréat),
    );
    this.#identifiantÉliminés = identifiantÉliminés.map((identifiantÉliminé) =>
      IdentifiantProjet.convertirEnValueType(identifiantÉliminé),
    );
  }

  apply(event: PériodeEvent) {
    match(event)
      .with({ type: 'ImportPériodeInitié-V1' }, this.applyImportPériodeInitié.bind(this))
      .with({ type: 'PériodeImportée-V1' }, this.applyPériodeImportée.bind(this))
      .with({ type: 'PériodeNotifiée-V1' }, this.applyPériodeNotifiée.bind(this))
      .exhaustive();
  }
}
