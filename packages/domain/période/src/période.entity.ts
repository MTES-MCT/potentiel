import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/core';

import { Période } from '.';

export type PériodeEntity = Entity<
  'période',
  {
    identifiantPériode: Période.IdentifiantPériode.ValueType;
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
