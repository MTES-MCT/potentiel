import { Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '.';

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

export type ProjetUtilisateurScope = AllScope | RégionScope | ProjetScope;

export type GetProjetUtilisateurScope = (email: Email.ValueType) => Promise<ProjetUtilisateurScope>;
