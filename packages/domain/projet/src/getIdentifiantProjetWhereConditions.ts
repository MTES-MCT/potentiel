// passer le scope
// passer les identifiants

import { Where, WhereCondition } from '@potentiel-domain/entity';

const test = (scope: ProjetUtilisateurScope, identifiantProjets?: Array<I): WhereCondition => {

      // const identifiantProjets =
      // scope.type === 'projet'
      //   ? identifiantProjet
      //     ? scope.identifiantProjets.filter((id) => id === identifiantProjet)
      //     : scope.identifiantProjets
      //   : identifiantProjet
      //     ? [identifiantProjet]
      //     : undefined;

  return scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined;
};
