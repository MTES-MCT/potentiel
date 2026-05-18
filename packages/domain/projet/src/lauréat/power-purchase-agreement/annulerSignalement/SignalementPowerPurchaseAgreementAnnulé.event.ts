import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../index.js';

export type SignalementPowerPurchaseAgreementAnnuléEvent = DomainEvent<
  'SignalementPowerPurchaseAgreementAnnulé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    annuléLe: DateTime.RawType;
    annuléPar: Email.RawType;
  }
>;
