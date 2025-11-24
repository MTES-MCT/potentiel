import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

export type NomProjetModifiéEvent = DomainEvent<
  'NomProjetModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    nomProjet: string;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;
