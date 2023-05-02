import { Find, QueryHandlerFactory } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '..';
import { ProjetReadModel } from '../projet.readModel';
import { isNone } from '@potentiel/monads';

export type ConsulterProjetQuery = {
  identifiantProjet: IdentifiantProjet;
};

type ConsulterProjetDependencies = {
  find: Find;
};

export const consulterProjetQueryHandlerFactory: QueryHandlerFactory<
  ConsulterProjetQuery,
  ProjetReadModel,
  ConsulterProjetDependencies
> = ({ find }) => {
  return async ({ identifiantProjet }) => {
    const result = await find<ProjetReadModel>(
      `projet#${formatIdentifiantProjet(identifiantProjet)}`,
    );

    if (isNone(result)) {
      return { type: 'projet' };
    }

    return result;
  };
};
