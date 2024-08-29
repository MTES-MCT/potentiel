import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/core';

import * as IdentifiantPériode from './identifiantPériode.valueType';

export type PériodeEntity = Entity<
  'période',
  {
    identifiantPériode: IdentifiantPériode.RawType;
  } & (PériodeNotifiée | PériodeNonNotifiée)
>;

type PériodeNonNotifiée = {
  estNotifiée: false;
};

type PériodeNotifiée = {
  estNotifiée: true;

  notifiéeLe: DateTime.RawType;
  notifiéePar: Email.RawType;

  lauréats: ReadonlyArray<IdentifiantProjet.RawType>;
  éliminés: ReadonlyArray<IdentifiantProjet.RawType>;
};
