import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../..';
import { TypologieInstallation } from '../../candidature';

export type InstallationEntity = Entity<
  'installation',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    misÀJourLe: DateTime.RawType;
    installateur: string;
    typologieInstallation: TypologieInstallation.RawType[];
  }
>;
