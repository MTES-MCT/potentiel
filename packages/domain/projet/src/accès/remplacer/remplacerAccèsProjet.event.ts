import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../..';

export type AccèsProjetRemplacéEvent = DomainEvent<
  'AccèsProjetRemplacé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantUtilisateur: Email.RawType;
    nouvelIdentifiantUtilisateur: Email.RawType;
    remplacéLe: DateTime.RawType;
    remplacéPar: Email.RawType;
  }
>;
