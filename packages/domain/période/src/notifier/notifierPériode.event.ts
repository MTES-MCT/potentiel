import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import * as IdentifiantPériode from '../identifiantPériode.valueType.js';

export type PériodeNotifiéeEvent = DomainEvent<
  'PériodeNotifiée-V1',
  {
    identifiantPériode: IdentifiantPériode.RawType;

    appelOffre: string;
    période: string;

    notifiéeLe: DateTime.RawType;
    notifiéePar: Email.RawType;

    identifiantLauréats: ReadonlyArray<IdentifiantProjet.RawType>;
    identifiantÉliminés: ReadonlyArray<IdentifiantProjet.RawType>;
  }
>;
