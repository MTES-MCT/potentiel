import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

export type PorteurInvitéEvent = DomainEvent<
  'PorteurInvité-V1',
  {
    identifiantUtilisateur: Email.RawType;
    /**
     * Cette donnée est informative (notifications)
     * et ne doit pas être utilisé pour gérer les accès aux projets.
     * Voir Projet.Accès pour cela.
     **/
    identifiantsProjet: string[];
    invitéLe: DateTime.RawType;
    invitéPar: Email.RawType;
  }
>;
