import { Readable } from 'stream';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { Find, QueryHandlerFactory, ReadModel } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { DossierRaccordementReadModel } from './dossierRaccordement.readModel';

type TéléchargerFichierDemandeComplèteRaccordement = () => {};

type TéléchargerFichierDemandeComplèteRaccordementDependencies = {
  find: Find;
  téléchargerFichierDemandeComplèteRaccordement: TéléchargerFichierDemandeComplèteRaccordement;
};

type TéléchargerFichierDemandeComplèteRaccordementQuery = {
  identifiantProjet: IdentifiantProjet;
  référenceDossierRaccordement: string;
};

type TéléchargerFichierDemandeComplèteRaccordementReadModel = ReadModel<
  'fichier-demander-complète-raccordement',
  { format: string; content: Readable }
>;

const téléchargerFichierDemandeComplèteRaccordementQueryHandlerFactory: QueryHandlerFactory<
  TéléchargerFichierDemandeComplèteRaccordementQuery,
  TéléchargerFichierDemandeComplèteRaccordementReadModel,
  TéléchargerFichierDemandeComplèteRaccordementDependencies
> =
  ({ find, téléchargerFichierDemandeComplèteRaccordement }) =>
  async ({ identifiantProjet, référenceDossierRaccordement }) => {
    const result = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${formatIdentifiantProjet(
        identifiantProjet,
      )}#${référenceDossierRaccordement}`,
    );
    if (isNone(result)) {
      throw new DossierRaccordementNonRéférencéError();
    }
    return {};
  };
