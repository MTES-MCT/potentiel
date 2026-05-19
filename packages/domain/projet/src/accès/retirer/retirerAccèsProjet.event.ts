import type { Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../index.js';

export type AccèsProjetRetiréEvent = DomainEvent<
  'AccèsProjetRetiré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantsUtilisateur: Array<Email.RawType>;
    retiréLe: string;
    retiréPar: string;
    cause?: 'changement-producteur';
  }
>;
