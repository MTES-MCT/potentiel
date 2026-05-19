import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { DateTime, Email } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { IdentifiantProjet } from '../index.js';
import type { StatutLauréat } from './index.js';

export type LauréatEntity = Entity<
  'lauréat',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéLe: DateTime.RawType;
    notifiéPar: Email.RawType;
    statut: StatutLauréat.RawType;
    nomProjet: string;
    appelOffre: string;
    période: string;
    famille?: string;
    localité: {
      adresse1: string;
      adresse2: string;
      codePostal: string;
      commune: string;
      région: string;
      département: string;
    };
    coordonnées?: {
      latitude: number;
      longitude: number;
    };
    cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.RawType;
  }
>;
