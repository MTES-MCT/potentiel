import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../index.js';
import { StatutLauréat } from '../index.js';

export type StatutLauréatModifiéEvent = DomainEvent<
  'StatutLauréatModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    statut: StatutLauréat.RawType;
  }
>;
