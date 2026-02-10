import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../index.js';

export type ProducteurModifiéEvent = DomainEvent<
  'ProducteurModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    producteur: string;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;
