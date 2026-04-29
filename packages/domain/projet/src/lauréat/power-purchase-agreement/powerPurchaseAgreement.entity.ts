import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type PowerPurchaseAgreementEntity = Entity<
  'power-purchase-agreement',
  {
    identifiantProjet: string;
    signaléLe: DateTime.RawType;
    estPartiEnPPA: true;
  }
>;
