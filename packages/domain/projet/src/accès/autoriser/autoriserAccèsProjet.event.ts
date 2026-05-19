import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../index.js';

export type AccèsProjetAutoriséEvent = DomainEvent<
  'AccèsProjetAutorisé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantUtilisateur: Email.RawType;
    autoriséLe: DateTime.RawType;
    autoriséPar: Email.RawType;
    raison: 'invitation' | 'notification' | 'réclamation';
  }
>;
