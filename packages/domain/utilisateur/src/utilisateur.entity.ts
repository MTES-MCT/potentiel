import { DateTime, Email } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { Région, Zone } from '.';

type Common = {
  identifiantUtilisateur: Email.RawType;
  invitéLe: DateTime.RawType;
  invitéPar: Email.RawType;
  désactivé?: true;
};

type UtilisateurGénérique = {
  rôle: 'admin' | 'ademe' | 'caisse-des-dépôts' | 'cre';
};

type UtilisateurDgecValidateur = {
  rôle: 'dgec-validateur';
  fonction: string;
  nomComplet: string;
};

type UtilisateurDreal = {
  rôle: 'dreal';
  région: Région.RawType;
};

type UtilisateurGestionnaireRéseau = {
  rôle: 'grd';
  identifiantGestionnaireRéseau: string;
};

type UtilisateurCocontractant = {
  rôle: 'cocontractant';
  zone: Zone.RawType;
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
      | UtilisateurCocontractant
    )
>;
