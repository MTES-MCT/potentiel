import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { TypologieInstallation } from '../../../../candidature/index.js';
import type { IdentifiantProjet } from '../../../../index.js';

export type TypologieInstallationModifiéeEvent = DomainEvent<
  'TypologieInstallationModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typologieInstallation: TypologieInstallation.RawType[];
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;
