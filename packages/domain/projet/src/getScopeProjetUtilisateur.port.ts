import { Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from './index.js';

export type ProjetUtilisateurScope = {
  identifiantProjets?: Array<IdentifiantProjet.RawType>;
  régions?: string[];
  identifiantGestionnaireRéseau?: string;
};

export type GetScopeProjetUtilisateur = (
  email: Email.ValueType,
  filterOnScope?: ProjetUtilisateurScope,
) => Promise<ProjetUtilisateurScope>;
