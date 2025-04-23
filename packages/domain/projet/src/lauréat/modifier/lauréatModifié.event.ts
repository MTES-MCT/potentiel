import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';

export type LauréatModifiéEvent = DomainEvent<
  'LauréatModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
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
