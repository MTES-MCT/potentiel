import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

type Common = {
  identifiantUtilisateur: Email.RawType;
  invitéLe: DateTime.RawType;
  invitéPar: Email.RawType;
};

type UtilisateurGénérique = {
  rôle: 'admin' | 'dgec-validateur' | 'acheteur-obligé' | 'ademe' | 'caisse-des-dépôts' | 'cre';
};

type UtilisateurDreal = {
  rôle: 'dreal';
  région: string;
};

type UtilisateurGestionnaireRéseau = {
  rôle: 'grd';
  identifiantGestionnaireRéseau: string;
};

type UtilisateurPorteur = {
  rôle: 'porteur-projet';
  projets: IdentifiantProjet.RawType[];
};

export type UtilisateurEntity = Entity<
  'utilisateur',
  Common &
    (UtilisateurGénérique | UtilisateurDreal | UtilisateurPorteur | UtilisateurGestionnaireRéseau)
>;
