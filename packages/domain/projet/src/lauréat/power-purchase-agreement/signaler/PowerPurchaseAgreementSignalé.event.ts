import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

export type PowerPurchaseAgreementSignaléEvent = DomainEvent<
  'PowerPurchaseAgreementSignalé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    signaléLe: DateTime.RawType;
    signaléPar: Email.RawType;
  }
>;
