import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../index.js';

export type SiteDeProductionModifiéEvent = DomainEvent<
  'SiteDeProductionModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
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
    raison?: string;
    pièceJustificative?: { format: string };
  }
>;
