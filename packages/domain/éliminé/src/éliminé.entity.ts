import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/core';

export type ÉliminéEntity = Entity<
  'éliminé',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateDésignation: DateTime.RawType;
  }
>;
