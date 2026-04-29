import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type PowerPurchaseAgreementEntity = Entity<
  'power-purchase-agreement',
  {
    identifiantProjet: string;
    estPartiEnPPA: boolean;
    signaléLe: DateTime.RawType;
  }
>;
