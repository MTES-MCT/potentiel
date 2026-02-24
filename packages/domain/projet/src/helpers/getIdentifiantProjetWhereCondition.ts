import { Where } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../index.js';
import { ProjetUtilisateurScope } from '../getScopeProjetUtilisateur.port.js';

export const getIdentifiantProjetWhereCondition = (
  scope: ProjetUtilisateurScope,
  identifiantProjet?: IdentifiantProjet.RawType,
) => {
  if (scope.type === 'projet' && identifiantProjet) {
    return Where.matchAny(scope.identifiantProjets.filter((id) => id === identifiantProjet));
  }

  if (scope.type === 'projet') {
    return Where.matchAny(scope.identifiantProjets);
  }

  return identifiantProjet ? Where.equal(identifiantProjet) : undefined;
};
