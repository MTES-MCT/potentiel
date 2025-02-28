import { Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

type UtilisateurGénérique = {
  identifiantUtilisateur: Email.RawType;
  rôle: 'admin' | 'acheteur-obligé' | 'ademe' | 'caisse-des-dépôts' | 'cre';
};

type UtilisateurDgecValidateur = {
  identifiantUtilisateur: Email.RawType;
  rôle: 'dgec-validateur';
  fonction: string;
  nomComplet: string;
};

type UtilisateurDreal = {
  identifiantUtilisateur: Email.RawType;
  rôle: 'dreal';
  région: string;
};

type UtilisateurGestionnaireRéseau = {
  identifiantUtilisateur: Email.RawType;
  rôle: 'grd';
  identifiantGestionnaireRéseau: string;
};

type UtilisateurPorteur = {
  identifiantUtilisateur: Email.RawType;
  rôle: 'porteur-projet';
  projets: IdentifiantProjet.RawType[];
};

export type UtilisateurEntity = Entity<
  'utilisateur',
  | UtilisateurGénérique
  | UtilisateurDreal
  | UtilisateurPorteur
  | UtilisateurDgecValidateur
  | UtilisateurGestionnaireRéseau
>;
