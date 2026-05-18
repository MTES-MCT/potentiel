import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { TypologieInstallation } from '../../../../candidature/index.js';
import { IdentifiantProjet } from '../../../../index.js';

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
