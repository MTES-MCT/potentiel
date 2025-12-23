import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';

export type DétailCandidatureImportéEvent = DomainEvent<
  'DétailCandidatureImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    détail: Record<string, string | number | boolean>;
  }
>;
