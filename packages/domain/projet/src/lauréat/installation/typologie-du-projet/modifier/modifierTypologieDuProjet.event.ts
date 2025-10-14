import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../..';
import { TypologieDuProjet } from '../../../../candidature';

export type TypologieDuProjetModifiéeEvent = DomainEvent<
  'TypologieDuProjetModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typologieDuProjet: TypologieDuProjet.RawType[];
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
  }
>;
