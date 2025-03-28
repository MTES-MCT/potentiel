import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../..';

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

export type CandidatureNotifiéeEvent = DomainEvent<
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
