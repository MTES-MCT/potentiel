import { DateTime, Email } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../index.js';

export type AchèvementEntity = Entity<
  'achèvement',
  {
    identifiantProjet: IdentifiantProjet.RawType;

    estAchevé: boolean;

    prévisionnel: {
      date: DateTime.RawType;
    };
    réel?: {
      date: DateTime.RawType;
      attestationConformité: { format: string; transmiseLe: DateTime.RawType };
      preuveTransmissionAuCocontractant?: { format: string; transmiseLe: DateTime.RawType };
      dernièreMiseÀJour: {
        date: DateTime.RawType;
        utilisateur: Email.RawType;
      };
    };
  }
>;
