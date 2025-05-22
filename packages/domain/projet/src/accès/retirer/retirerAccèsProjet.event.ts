import { Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../..';

export type AccèsProjetRetiréEvent = DomainEvent<
  'AccèsProjetRetiré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantsUtilisateur: Array<Email.RawType>;
    retiréLe: string;
    retiréPar: string;
    cause?: 'changement-producteur';
  }
>;
