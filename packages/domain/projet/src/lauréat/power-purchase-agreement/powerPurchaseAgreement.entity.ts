import { DateTime, Email } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type PowerPurchaseAgreementEntity = Entity<
  'power-purchase-agreement',
  {
    identifiantProjet: string;
    signaléLe: DateTime.RawType;
    signaléPar: Email.RawType;
    estPartiEnPPA: true;
  }
>;
