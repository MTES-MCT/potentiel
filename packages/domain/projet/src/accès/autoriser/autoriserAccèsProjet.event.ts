import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../..';

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
