import { Find, QueryHandlerFactory } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { ListeDossiersRaccordementReadModel } from './listeDossierRaccordement.readModel';

type ListerDossiersRaccordementQuery = { identifiantProjet: IdentifiantProjet };

type Dependencies = {
  find: Find;
};

export const listerDossiersRaccordementQueryHandlerFactory: QueryHandlerFactory<
  ListerDossiersRaccordementQuery,
  ListeDossiersRaccordementReadModel,
  Dependencies
> =
  ({ find }) =>
  async ({ identifiantProjet }) => {
    const result = await find<ListeDossiersRaccordementReadModel>(
      `liste-dossiers-raccordement#${formatIdentifiantProjet(identifiantProjet)}`,
    );
    if (isNone(result)) {
      throw new Error('Not implemented');
    }
    return result;
  };
