import type { DateTime, Email } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { IdentifiantProjet } from '../../index.js';

export type AchèvementEntity = Entity<
  'achèvement',
  {
    identifiantProjet: IdentifiantProjet.RawType;

    estAchevé: boolean;

    prévisionnel: {
      date: DateTime.RawType;
      aBénéficiéDuDélaiCDC2022?: boolean;
    };
    réel?: {
      date: DateTime.RawType;
      attestationConformité?: { format: string; transmiseLe: DateTime.RawType };
      rapportAssocié?: { format: string; transmisLe: DateTime.RawType };
      preuveTransmissionAuCocontractant?: { format: string; transmiseLe: DateTime.RawType };
      dernièreMiseÀJour: {
        date: DateTime.RawType;
        utilisateur: Email.RawType;
      };
    };
  }
>;
