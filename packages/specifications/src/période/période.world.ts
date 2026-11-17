import { DateTime, Email } from '@potentiel-domain/common';
import { Période } from '@potentiel-domain/periode';

import { InitierImportPériodeFixture } from './fixtures/initierImportPériode.fixture.js';
import { NotifierPériodeFixture } from './fixtures/notifierPériode.fixture.js';

export class PériodeWorld {
  #identifiantPériode!: Période.IdentifiantPériode.ValueType;
  get identifiantPériode() {
    return this.#identifiantPériode;
  }

  #initierImportPériodeFixture: InitierImportPériodeFixture;

  #notifierPériodeFixture: NotifierPériodeFixture;

  get initierImportPériodeFixture() {
    return this.#initierImportPériodeFixture;
  }

  get notifierPériodeFixture() {
    return this.#notifierPériodeFixture;
  }

  constructor() {
    this.#identifiantPériode = Période.IdentifiantPériode.convertirEnValueType('PPE2 - Eolien#1');
    this.#notifierPériodeFixture = new NotifierPériodeFixture();
    this.#initierImportPériodeFixture = new InitierImportPériodeFixture();
  }

  mapToExpected(
    identifiantPériode: Période.IdentifiantPériode.ValueType,
  ): Période.ConsulterPériodeReadModel {
    if (!this.#notifierPériodeFixture.aÉtéCréé && !this.#initierImportPériodeFixture.aÉtéCréé) {
      throw new Error(`Aucune période n'a été créée dans PériodeWorld`);
    }

    const statutPériode = this.#notifierPériodeFixture.aÉtéCréé
      ? Période.StatutPériode.notifiée
      : Période.StatutPériode.importInitié;

    const expected: Période.ConsulterPériodeReadModel = {
      identifiantPériode,
      statutPériode: statutPériode,
      ...(statutPériode.estNotifiée() && {
        notifiéeLe: DateTime.convertirEnValueType(this.#notifierPériodeFixture.notifiéeLe),
        notifiéePar: Email.convertirEnValueType(this.#notifierPériodeFixture.notifiéePar),
      }),
    };

    return expected;
  }
}
