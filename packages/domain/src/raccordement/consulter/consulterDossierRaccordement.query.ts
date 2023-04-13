import { Find, QueryHandlerFactory } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementReadModel } from './dossierRaccordement.readModel';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';

type ConsulterDossierRaccordementQuery = { référence: string };

type Dependencies = {
  find: Find;
};

export const consulterDossierRaccordementQueryHandlerFactory: QueryHandlerFactory<
  ConsulterDossierRaccordementQuery,
  DossierRaccordementReadModel,
  Dependencies
> =
  ({ find }) =>
  async ({ référence }) => {
    const result = await find<DossierRaccordementReadModel>(`dossier-raccordement#${référence}`);
    if (isNone(result)) {
      throw new DossierRaccordementNonRéférencéError();
    }
    return result;
  };
