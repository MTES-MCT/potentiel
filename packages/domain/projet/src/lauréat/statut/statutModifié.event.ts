import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';
import { StatutLauréat } from '..';

export type StatutLauréatModifiéEvent = DomainEvent<
  'StatutLauréatModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    statut: StatutLauréat.RawType;
  }
>;
