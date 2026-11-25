import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { Type } from '../filters.types.js';

export type FiltresUtilisateurDéfinisEvent = DomainEvent<
  'FiltresUtilisateurDéfinis-V1',
  {
    identifiantUtilisateur: Email.RawType;
    définiLe: DateTime.RawType;
    filtres: Type;
  }
>;
