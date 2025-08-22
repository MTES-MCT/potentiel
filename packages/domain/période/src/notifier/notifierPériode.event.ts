import type { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type * as IdentifiantPériode from '../identifiantPériode.valueType';

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
