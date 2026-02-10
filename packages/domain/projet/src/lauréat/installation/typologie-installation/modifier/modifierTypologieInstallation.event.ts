import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../../index.js';
import { TypologieInstallation } from '../../../../candidature/index.js';

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
