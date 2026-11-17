import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';
import type { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import type * as IdentifiantPériode from '../identifiantPériode.valueType.js';

export type ImportPériodeInitiéEvent = DomainEvent<
  'ImportPériodeInitié-V1',
  {
    identifiantPériode: IdentifiantPériode.RawType;

    appelOffre: string;
    période: string;

    initiéLe: DateTime.RawType;
    initiéPar: Email.RawType;

    instruction: Array<
      {
        identifiantProjet: IdentifiantProjet.RawType;
      } & Candidature.Instruction.RawType
    >;

    vérifierLesDonnéesSansImportRéel?: true;
  }
>;
