import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../index.js';
import type { StatutCandidature } from '../index.js';

/**
 * @deprecated Utilisez CandidatureNotifiéeEvent à la place.
 * @deprecated Cet évènement sert à importer les projets de périodes legacy, sans attestation.
 */
export type CandidatureNotifiéeEventV1 = DomainEvent<
  'CandidatureNotifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéeLe: DateTime.RawType;
    notifiéePar: Email.RawType;
    validateur: AppelOffre.Validateur;
  }
>;

/**
 * @deprecated Utilisez CandidatureNotifiéeEvent à la place.
 * @deprecated Cet évènement ne contenait pas le statut de désignation.
 */
export type CandidatureNotifiéeEventV2 = DomainEvent<
  'CandidatureNotifiée-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéeLe: DateTime.RawType;
    notifiéePar: Email.RawType;
    validateur: AppelOffre.Validateur;
    attestation: {
      format: string;
    };
  }
>;

export type CandidatureNotifiéeEvent = DomainEvent<
  'CandidatureNotifiée-V3',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    statut: StatutCandidature.RawType;
    notifiéeLe: DateTime.RawType;
    notifiéePar: Email.RawType;
    validateur: AppelOffre.Validateur;
    attestation: {
      format: string;
    };
  }
>;
