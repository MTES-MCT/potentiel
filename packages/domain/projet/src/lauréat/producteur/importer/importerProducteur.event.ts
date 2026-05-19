import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';
import type { NuméroIdentification } from '../index.js';

export type ProducteurImportéEvent = DomainEvent<
  'ProducteurImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    producteur: string;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
    numéroIdentification?: NuméroIdentification.RawType;
  }
>;
