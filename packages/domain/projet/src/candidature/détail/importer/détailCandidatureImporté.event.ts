import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';
import { DétailCandidature } from '../../index.js';

export type DétailCandidatureImportéEvent = DomainEvent<
  'DétailCandidatureImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    détail: DétailCandidature.RawType;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;
