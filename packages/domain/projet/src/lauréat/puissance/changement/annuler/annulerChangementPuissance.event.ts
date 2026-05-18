import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../index.js';
import type { AutoritéCompétente } from '../../index.js';

export type ChangementPuissanceAnnuléEvent = DomainEvent<
  'ChangementPuissanceAnnulé-V1',
  {
    annuléLe: DateTime.RawType;
    annuléPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    autoritéCompétente?: AutoritéCompétente.RawType;
  }
>;
