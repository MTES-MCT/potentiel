import { Find, QueryHandlerFactory } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '..';
import { GestionnaireRéseauReadModel, ProjetReadModel } from '../projet.readModel';
import { isNone } from '@potentiel/monads';
import { ProjetInconnuError } from './projetInconnu.error';

export type ConsulterProjetQuery = {
  identifiantProjet: IdentifiantProjet;
};

type ConsulterProjetDependencies = {
  find: Find;
};

export const consulterProjetQueryHandlerFactory: QueryHandlerFactory<
  ConsulterProjetQuery,
  GestionnaireRéseauReadModel,
  ConsulterProjetDependencies
> = ({ find }) => {
  return async ({ identifiantProjet }) => {
    const result = await find<ProjetReadModel>(
      `projet#${formatIdentifiantProjet(identifiantProjet)}`,
    );

    if (isNone(result)) {
      throw new ProjetInconnuError();
    }

    return result;
  };
};
