import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

/**
 * Représente la correction de la date d'achèvement par le Cocontractant,
 * quel que soit l'évènement initial
 * (DateAchèvementTransmise ou AttestationConformitéTransmise).
 **/
export type DateAchèvementCorrigéeEvent = DomainEvent<
  'DateAchèvementCorrigée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;

    dateAchèvement: DateTime.RawType;
    corrigéeLe: DateTime.RawType;
    corrigéePar: Email.RawType;
  }
>;
