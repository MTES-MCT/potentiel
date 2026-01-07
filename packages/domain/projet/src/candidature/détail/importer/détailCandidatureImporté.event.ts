import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';
import { DétailCandidature } from '../détailCandidature.type';

export type DétailCandidatureImportéEvent = DomainEvent<
  'DétailCandidatureImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    détail: DétailCandidature;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;
