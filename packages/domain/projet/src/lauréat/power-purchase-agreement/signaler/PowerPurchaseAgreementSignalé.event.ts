import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

export type PowerPurchaseAgreementSignaléEvent = DomainEvent<
  'PowerPurchaseAgreementSignalé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    signaléLe: DateTime.RawType;
    signaléPar: Email.RawType;
  }
>;
