import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '..';

export type LauréatEntity = Entity<
  'lauréat',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéLe: DateTime.RawType;
    notifiéPar: Email.RawType;
    nomProjet: { nom: string; miseÀJourLe: DateTime.RawType };
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
    cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.RawType;
  }
>;
