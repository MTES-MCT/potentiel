import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

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
