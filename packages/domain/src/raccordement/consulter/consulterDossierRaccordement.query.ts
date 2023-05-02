import { Find, QueryHandlerFactory } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementReadModel } from './dossierRaccordement.readModel';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';

type ConsulterDossierRaccordementQuery = {
  identifiantProjet: IdentifiantProjet;
  référence: string;
};

type Dependencies = {
  find: Find;
};

export const consulterDossierRaccordementQueryHandlerFactory: QueryHandlerFactory<
  ConsulterDossierRaccordementQuery,
  DossierRaccordementReadModel,
  Dependencies
> =
  ({ find }) =>
  async ({ identifiantProjet, référence }) => {
    const result = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${formatIdentifiantProjet(identifiantProjet)}#${référence}`,
    );
    if (isNone(result)) {
      throw new DossierRaccordementNonRéférencéError();
    }
    return result;
  };
