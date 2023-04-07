import { Find, QueryHandlerFactory } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DemandeComplèteRaccordementReadModel } from './demandeComplèteRaccordement.readModel';

type ConsulterDemandeComplèteRaccordementQuery = { référenceDemandeRaccordement: string };

type Dependencies = {
  find: Find<DemandeComplèteRaccordementReadModel>;
};

export const consulterDemandeComplèteRaccordementQueryHandlerFactory: QueryHandlerFactory<
  ConsulterDemandeComplèteRaccordementQuery,
  DemandeComplèteRaccordementReadModel,
  Dependencies
> =
  ({ find }) =>
  async ({ référenceDemandeRaccordement }) => {
    const result = await find(`demande-complète-raccordement#${référenceDemandeRaccordement}`);
    if (isNone(result)) {
      throw new Error('Not implemented');
    }
    return result;
  };
