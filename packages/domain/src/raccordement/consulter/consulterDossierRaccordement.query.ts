import { Find, QueryHandlerFactory } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementReadModel } from './dossierRaccordement.readModel';

type ConsulterDossierRaccordementQuery = { référenceDemandeRaccordement: string };

type Dependencies = {
  find: Find;
};

export const consulterDossierRaccordementQueryHandlerFactory: QueryHandlerFactory<
  ConsulterDossierRaccordementQuery,
  DossierRaccordementReadModel,
  Dependencies
> =
  ({ find }) =>
  async ({ référenceDemandeRaccordement }) => {
    const result = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${référenceDemandeRaccordement}`,
    );
    if (isNone(result)) {
      throw new Error('Not implemented');
    }
    return result;
  };
