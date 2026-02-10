import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { IdentifiantProjet } from '../../../index.js';

export type CahierDesChargesChoisiEvent = DomainEvent<
  'CahierDesChargesChoisi-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.RawType;
  }
>;
