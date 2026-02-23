import { Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from './index.js';

type AllScope = {
  type: 'all';
};

type RégionScope = {
  type: 'région';
  régions: string[];
};

type ProjetScope = {
  type: 'projet';
  identifiantProjets: Array<IdentifiantProjet.RawType>;
};

type GestionnaireRéseauScope = {
  type: 'gestionnaire-réseau';
  identifiantGestionnaireRéseau: string;
};

export type ProjetUtilisateurScope = AllScope | RégionScope | ProjetScope | GestionnaireRéseauScope;

export type GetScopeProjetUtilisateur = (email: Email.ValueType) => Promise<ProjetUtilisateurScope>;
