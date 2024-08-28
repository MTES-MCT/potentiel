import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/core';

export type LauréatEntity = Entity<
  'lauréat',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateDésignation: DateTime.RawType;
    attestationSignée: {
      format: string;
    };
  }
>;
