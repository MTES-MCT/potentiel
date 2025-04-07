import { Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '.';

type NoneScope = {
  type: 'none';
};

type DrealScope = {
  type: 'dreal';
  region: string;
};

type PorteurScope = {
  type: 'porteur';
  identifiantProjets: Array<IdentifiantProjet.RawType>;
};

export type ScopeProjetUtilisateur = NoneScope | DrealScope | PorteurScope;

export type GetScopeProjetUtilisateur = (email: Email.ValueType) => Promise<ScopeProjetUtilisateur>;
