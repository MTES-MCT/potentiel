import { Where } from '@potentiel-domain/entity';

import { IdentifiantProjet } from './index.js';

import { ProjetUtilisateurScope } from './getScopeProjetUtilisateur.port.js';

export const getIdentifiantProjetWhereConditions = (
  scope: ProjetUtilisateurScope,
  identifiantProjets?: Array<IdentifiantProjet.RawType>,
) => {
  if (scope.type === 'projet' && identifiantProjets?.length) {
    return Where.matchAny(identifiantProjets.filter((id) => scope.identifiantProjets.includes(id)));
  }

  if (scope.type === 'projet') {
    return Where.matchAny(scope.identifiantProjets);
  }

  return identifiantProjets?.length ? Where.matchAny(identifiantProjets) : undefined;
};
