import { Période } from '@potentiel-domain/periode';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantPériode } from '@potentiel-domain/periode/dist/période';

import { NotifierPériodeFixture } from './fixtures/notifierPériode.fixture';

export class PériodeWorld {
  #identifiantPériode!: IdentifiantPériode.ValueType;
  get identifiantPériode() {
    return this.#identifiantPériode;
  }

  #notifierPériodeFixture: NotifierPériodeFixture;

  get notifierPériodeFixture() {
    return this.#notifierPériodeFixture;
  }

  constructor() {
    this.#identifiantPériode = IdentifiantPériode.convertirEnValueType('PPE2 - Eolien#1');
    this.#notifierPériodeFixture = new NotifierPériodeFixture();
  }

  reinitialiserPériode() {
    this.#notifierPériodeFixture = new NotifierPériodeFixture();
  }

  mapToExpected(
    identifiantPériode: Période.IdentifiantPériode.ValueType,
  ): Période.ConsulterPériodeReadModel {
    if (!this.#notifierPériodeFixture.aÉtéCréé) {
      throw new Error(`Aucune période notifiée n'a été créée dans PériodeWorld`);
    }

    if (this.#notifierPériodeFixture.estNotifiée) {
      const expected: Période.ConsulterPériodeReadModel = {
        identifiantPériode,
        estNotifiée: this.#notifierPériodeFixture.estNotifiée,
        lauréats: this.#notifierPériodeFixture.lauréats.map((lauréat) =>
          IdentifiantProjet.convertirEnValueType(lauréat),
        ),
        éliminés: this.#notifierPériodeFixture.éliminés.map((éliminé) =>
          IdentifiantProjet.convertirEnValueType(éliminé),
        ),
        notifiéeLe: DateTime.convertirEnValueType(this.#notifierPériodeFixture.notifiéeLe),
        notifiéePar: Email.convertirEnValueType(this.#notifierPériodeFixture.notifiéePar),
      };

      return expected;
    } else {
      return {
        identifiantPériode,
        estNotifiée: this.#notifierPériodeFixture.estNotifiée,
      };
    }
  }
}
