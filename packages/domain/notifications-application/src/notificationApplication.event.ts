import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

type DomainesAvecChangement =
  | 'fournisseur'
  | 'producteur'
  | 'nature-de-l-exploitation'
  | 'installateur'
  | 'dispositif-de-stockage'
  | 'nom-projet'
  | 'actionnaire'
  | 'puissance'
  | 'représentant-légal';

export type NotificationApplicationEvent = NotificationApplicationAjoutéeEvent;

export type NotificationApplicationAjoutéeEvent = DomainEvent<
  'NotificationApplicationAjoutée-V1',
  {
    domaine: DomainesAvecChangement;
    identifiantProjet: IdentifiantProjet.RawType;
    dateChangement: DateTime.RawType;
    identifiantUtilisateur: Email.RawType;
  }
>;
