import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import * as IdentifiantPériode from './identifiantPériode.valueType.js';
import { PériodeNotifiéeEvent } from './notifier/notifierPériode.event.js';
import { NotifierPériodeOptions } from './notifier/notifierPériode.options.js';

export type PériodeEvent = PériodeNotifiéeEvent;

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

  apply(event: PériodeEvent) {
    match(event)
      .with({ type: 'PériodeNotifiée-V1' }, this.applyPériodeNotifiée.bind(this))
      .exhaustive();
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
}
