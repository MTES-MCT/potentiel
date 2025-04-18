import { Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '.';

type AllScope = {
  type: 'all';
};

type RegionScope = {
  type: 'region';
  region: string;
};

type ProjetScope = {
  type: 'projet';
  identifiantProjets: Array<IdentifiantProjet.RawType>;
};

export type ProjetUtilisateurScope = AllScope | RegionScope | ProjetScope;

export type GetProjetUtilisateurScope = (email: Email.ValueType) => Promise<ProjetUtilisateurScope>;
