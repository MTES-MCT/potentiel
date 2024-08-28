import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/core';

import * as IdentifiantPériode from './identifiantPériode.valueType';

export type PériodeEntity = Entity<
  'période',
  {
    identifiantPériode: IdentifiantPériode.ValueType;
  } & (PériodeNotifiée | PériodeNonNotifiée)
>;

type PériodeNonNotifiée = {
  estNotifiée: false;
};

type PériodeNotifiée = {
  estNotifiée: true;

  notifiéeLe: DateTime.ValueType;
  notifiéePar: Email.ValueType;

  lauréats: ReadonlyArray<IdentifiantProjet.ValueType>;
  éliminés: ReadonlyArray<IdentifiantProjet.ValueType>;
};
