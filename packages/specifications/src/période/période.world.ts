import { Période } from '@potentiel-domain/periode';
import { DateTime, Email } from '@potentiel-domain/common';

import { NotifierPériodeFixture } from './fixtures/notifierPériode.fixture.js';

export class PériodeWorld {
  #identifiantPériode!: Période.IdentifiantPériode.ValueType;
  get identifiantPériode() {
    return this.#identifiantPériode;
  }

  #notifierPériodeFixture: NotifierPériodeFixture;

  get notifierPériodeFixture() {
    return this.#notifierPériodeFixture;
  }

  constructor() {
    this.#identifiantPériode = Période.IdentifiantPériode.convertirEnValueType('PPE2 - Eolien#1');
    this.#notifierPériodeFixture = new NotifierPériodeFixture();
  }

  mapToExpected(
    identifiantPériode: Période.IdentifiantPériode.ValueType,
  ): Période.ConsulterPériodeReadModel {
    if (!this.#notifierPériodeFixture.aÉtéCréé) {
      throw new Error(`Aucune période notifiée n'a été créée dans PériodeWorld`);
    }

    const expected: Période.ConsulterPériodeReadModel = {
      identifiantPériode,
      estNotifiée: true,
      notifiéeLe: DateTime.convertirEnValueType(this.#notifierPériodeFixture.notifiéeLe),
      notifiéePar: Email.convertirEnValueType(this.#notifierPériodeFixture.notifiéePar),
    };

    return expected;
  }
}
