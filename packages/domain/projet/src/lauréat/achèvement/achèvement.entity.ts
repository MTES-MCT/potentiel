import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../..';

export type AchèvementEntity = Entity<
  'achèvement',
  {
    identifiantProjet: IdentifiantProjet.RawType;

    estAchevé: boolean;

    prévisionnel: {
      date: DateTime.RawType;
    };
    réel?: {
      attestationConformité: { format: string; date: string };
      preuveTransmissionAuCocontractant: { format: string; date: string };
      dernièreMiseÀJour: {
        date: string;
        utilisateur: string;
      };
    };
  }
>;
