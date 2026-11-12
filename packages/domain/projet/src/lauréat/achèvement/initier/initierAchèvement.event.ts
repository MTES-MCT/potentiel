import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

/**
 * Représente l'initiation de l'achèvement par le Porteur.
 * Le projet reste en attente d'achèvement jusqu'à la transmission de la date par le Cocontractant.
 **/
export type AchèvementInitiéEvent = DomainEvent<
  'AchèvementInitié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    initiéLe: DateTime.RawType;
    initiéPar: Email.RawType;
  }
>;
