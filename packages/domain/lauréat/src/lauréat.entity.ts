import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type LauréatEntity = Entity<
  'lauréat',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéLe: DateTime.RawType;
    notifiéPar: Email.RawType;
    nomProjet: string;
    localité: {
      adresse1: string;
      adresse2: string;
      codePostal: string;
      commune: string;
      région: string;
      département: string;
    };
  }
>;
