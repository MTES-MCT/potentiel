import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../..';

export type InstallationEntity = Entity<
  'installation',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    misÀJourLe: DateTime.RawType;
    installateur: string | undefined;
  }
>;
