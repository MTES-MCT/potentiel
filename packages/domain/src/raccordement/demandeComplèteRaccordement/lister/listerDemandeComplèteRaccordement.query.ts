import { Find, QueryHandlerFactory } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet';
import { ListeDemandeComplèteRaccordementReadModel } from './listeDemandeComplèteRaccordement.readModel';

type ListerDemandeComplèteRaccordementQuery = { identifiantProjet: IdentifiantProjet };

type Dependencies = {
  find: Find;
};

export const listerDemandeComplèteRaccordementQueryHandlerFactory: QueryHandlerFactory<
  ListerDemandeComplèteRaccordementQuery,
  ListeDemandeComplèteRaccordementReadModel,
  Dependencies
> =
  ({ find }) =>
  async ({ identifiantProjet }) => {
    const result = await find<ListeDemandeComplèteRaccordementReadModel>(
      `liste-demande-complète-raccordement#${formatIdentifiantProjet(identifiantProjet)}`,
    );
    if (isNone(result)) {
      throw new Error('Not implemented');
    }
    return result;
  };
