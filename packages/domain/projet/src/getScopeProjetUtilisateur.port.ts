import type { Email } from '@potentiel-domain/common';
import type { Région } from '@potentiel-domain/utilisateur';

import type { IdentifiantProjet } from './index.js';

export type ProjetUtilisateurScope = {
  identifiantProjets?: Array<IdentifiantProjet.RawType>;
  régions?: Région.RawType[];
  identifiantGestionnaireRéseau?: string;
};

export type GetScopeProjetUtilisateur = (
  email: Email.ValueType,
  filterOnScope?: ProjetUtilisateurScope,
) => Promise<ProjetUtilisateurScope>;
