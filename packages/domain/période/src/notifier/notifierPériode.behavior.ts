import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import * as IdentifiantPériode from '../identifiantPériode.valueType';
import { PériodeAggregate } from '../période.aggregate';

export type PériodeNotifiéeEvent = DomainEvent<
  'PériodeNotifiée-V1',
  {
    identifiantPériode: IdentifiantPériode.RawType;

    notifiéeLe: DateTime.RawType;
    notifiéePar: Email.RawType;

    lauréats: ReadonlyArray<IdentifiantProjet.RawType>;
    éliminés: ReadonlyArray<IdentifiantProjet.RawType>;
  }
>;

export type NotifierPériodeOptions = {
  identifiantPériode: IdentifiantPériode.ValueType;
  notifiéeLe: DateTime.ValueType;
  notifiéePar: Email.ValueType;
  lauréats: ReadonlyArray<IdentifiantProjet.ValueType>;
  éliminés: ReadonlyArray<IdentifiantProjet.ValueType>;
};

export async function notifier(
  this: PériodeAggregate,
  { identifiantPériode, lauréats, éliminés, notifiéeLe, notifiéePar }: NotifierPériodeOptions,
) {
  const event: PériodeNotifiéeEvent = {
    type: 'PériodeNotifiée-V1',
    payload: {
      identifiantPériode: identifiantPériode.formatter(),
      notifiéeLe: notifiéeLe.formatter(),
      notifiéePar: notifiéePar.formatter(),
      lauréats: lauréats.map((lauréat) => lauréat.formatter()),
      éliminés: éliminés.map((éliminé) => éliminé.formatter()),
    },
  };

  await this.publish(event);
}

export function applyPériodeNotifiée(
  this: PériodeAggregate,
  { payload: { identifiantPériode, lauréats, éliminés } }: PériodeNotifiéeEvent,
) {
  this.identifiantPériode = IdentifiantPériode.convertirEnValueType(identifiantPériode);
  this.lauréats = lauréats.map((lauréat) => IdentifiantProjet.convertirEnValueType(lauréat));
  this.éliminés = éliminés.map((éliminé) => IdentifiantProjet.convertirEnValueType(éliminé));
}
