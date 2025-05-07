import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { AchèvementEvent } from './achèvement.event';
import { AttestationConformitéTransmiseEvent } from './transmettre/transmettreAttestationConformité.event';

export class AchèvementAggregate extends AbstractAggregate<AchèvementEvent> {
  #lauréat!: LauréatAggregate;
  get lauréat() {
    return this.#lauréat;
  }

  #estAchevé: boolean = false;
  get estAchevé() {
    return this.#estAchevé;
  }

  async init(lauréat: LauréatAggregate) {
    this.#lauréat = lauréat;
  }

  apply(event: AchèvementEvent): void {
    match(event)
      .with(
        {
          type: 'AttestationConformitéTransmise-V1',
        },
        (event) => this.applyAttestationConformitéTransmiseV1(event),
      )
      .exhaustive();
  }

  private applyAttestationConformitéTransmiseV1(_event: AttestationConformitéTransmiseEvent) {
    this.#estAchevé = true;
  }
}
