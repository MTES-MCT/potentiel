import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import * as IdentifiantPériode from '../identifiantPériode.valueType';
import { PériodeAggregate } from '../période.aggregate';

export type PériodeNotifiéeEvent = DomainEvent<
  'PériodeNotifiée-V1',
  {
    identifiantPériode: IdentifiantPériode.RawType;

    appelOffre: string;
    période: string;

    notifiéeLe: DateTime.RawType;
    notifiéePar: Email.RawType;

    identifiantLauréats: ReadonlyArray<IdentifiantProjet.RawType>;
    identifiantÉliminés: ReadonlyArray<IdentifiantProjet.RawType>;
  }
>;

export type NotifierPériodeOptions = {
  identifiantPériode: IdentifiantPériode.ValueType;
  notifiéeLe: DateTime.ValueType;
  notifiéePar: Email.ValueType;
  identifiantLauréats: ReadonlyArray<IdentifiantProjet.ValueType>;
  identifiantÉliminés: ReadonlyArray<IdentifiantProjet.ValueType>;
};

export async function notifier(
  this: PériodeAggregate,
  {
    identifiantPériode,
    identifiantLauréats,
    identifiantÉliminés,
    notifiéeLe,
    notifiéePar,
  }: NotifierPériodeOptions,
) {
  const event: PériodeNotifiéeEvent = {
    type: 'PériodeNotifiée-V1',
    payload: {
      identifiantPériode: identifiantPériode.formatter(),
      appelOffre: identifiantPériode.appelOffre,
      période: identifiantPériode.période,
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

export function applyPériodeNotifiée(
  this: PériodeAggregate,
  {
    payload: { identifiantPériode, identifiantLauréats, identifiantÉliminés },
  }: PériodeNotifiéeEvent,
) {
  this.identifiantPériode = IdentifiantPériode.convertirEnValueType(identifiantPériode);
  this.identifiantLauréats = identifiantLauréats.map((identifiantLauréat) =>
    IdentifiantProjet.convertirEnValueType(identifiantLauréat),
  );
  this.identifiantÉliminés = identifiantÉliminés.map((identifiantÉliminé) =>
    IdentifiantProjet.convertirEnValueType(identifiantÉliminé),
  );
}
