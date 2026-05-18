import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

export type CahierDesChargesChoisiEvent = DomainEvent<
  'CahierDesChargesChoisi-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.RawType;
  }
>;
