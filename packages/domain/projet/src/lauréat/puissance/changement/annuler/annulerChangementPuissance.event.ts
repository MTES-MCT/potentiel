import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { AutoritéCompétente } from '../..';
import { IdentifiantProjet } from '../../../..';

export type ChangementPuissanceAnnuléEvent = DomainEvent<
  'ChangementPuissanceAnnulé-V1',
  {
    annuléLe: DateTime.RawType;
    annuléPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    autoritéCompétente?: AutoritéCompétente.RawType;
  }
>;
