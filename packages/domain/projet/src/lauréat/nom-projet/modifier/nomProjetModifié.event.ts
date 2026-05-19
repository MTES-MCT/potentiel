import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

export type NomProjetModifiéEvent = DomainEvent<
  'NomProjetModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    ancienNomProjet: string;
    nomProjet: string;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;
