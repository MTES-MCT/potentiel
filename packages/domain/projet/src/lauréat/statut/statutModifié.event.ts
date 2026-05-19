import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../index.js';
import type { StatutLauréat } from '../index.js';

export type StatutLauréatModifiéEvent = DomainEvent<
  'StatutLauréatModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    statut: StatutLauréat.RawType;
  }
>;
