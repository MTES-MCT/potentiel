import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import * as IdentifiantPériode from './identifiantPériode.valueType';

export type PériodeEntity = Entity<
  'période',
  {
    identifiantPériode: IdentifiantPériode.RawType;
    appelOffre: string;
    période: string;
    estNotifiée: boolean;

    notifiéeLe: DateTime.RawType;
    notifiéePar: Email.RawType;

    identifiantLauréats: ReadonlyArray<IdentifiantProjet.RawType>;
    identifiantÉliminés: ReadonlyArray<IdentifiantProjet.RawType>;
  }
>;
