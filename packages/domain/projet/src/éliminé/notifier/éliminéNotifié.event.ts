import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';

export type ÉliminéNotifiéEvent = DomainEvent<
  'ÉliminéNotifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéLe: DateTime.RawType;
    notifiéPar: Email.RawType;
    attestation: {
      format: string;
    };
  }
>;
