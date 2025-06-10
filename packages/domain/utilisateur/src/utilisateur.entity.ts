import { DateTime, Email } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

type Common = {
  identifiantUtilisateur: Email.RawType;
  invitéLe: DateTime.RawType;
  invitéPar: Email.RawType;
  désactivé?: true;
};

type UtilisateurGénérique = {
  rôle: 'admin' | 'acheteur-obligé' | 'ademe' | 'caisse-des-dépôts' | 'cre';
};

type UtilisateurDgecValidateur = {
  rôle: 'dgec-validateur';
  fonction: string;
  nomComplet: string;
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
};

export type UtilisateurEntity = Entity<
  'utilisateur',
  Common &
    (
      | UtilisateurGénérique
      | UtilisateurDreal
      | UtilisateurPorteur
      | UtilisateurDgecValidateur
      | UtilisateurGestionnaireRéseau
    )
>;
