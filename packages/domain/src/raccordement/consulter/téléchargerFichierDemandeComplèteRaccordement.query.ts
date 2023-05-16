import { Readable } from 'stream';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { Find, QueryHandlerFactory, ReadModel } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  DossierRaccordementNonRéférencéError,
  FormatFichierInexistantError,
} from '../raccordement.errors';
import { DossierRaccordementReadModel } from './dossierRaccordement.readModel';
import { RécupérerFichierDemandeComplèteRaccordement } from './récupérerFichierDemandeComplèteRaccordement';
import { extension } from 'mime-types';

type TéléchargerFichierDemandeComplèteRaccordementDependencies = {
  find: Find;
  récupérerFichierDemandeComplèteRaccordement: RécupérerFichierDemandeComplèteRaccordement;
};

export type TéléchargerFichierDemandeComplèteRaccordementQuery = {
  identifiantProjet: IdentifiantProjet;
  référenceDossierRaccordement: string;
};

type TéléchargerFichierDemandeComplèteRaccordementReadModel = ReadModel<
  'fichier-demander-complète-raccordement',
  { format: string; content: Readable }
>;

export const téléchargerFichierDemandeComplèteRaccordementQueryHandlerFactory: QueryHandlerFactory<
  TéléchargerFichierDemandeComplèteRaccordementQuery,
  TéléchargerFichierDemandeComplèteRaccordementReadModel,
  TéléchargerFichierDemandeComplèteRaccordementDependencies
> =
  ({ find, récupérerFichierDemandeComplèteRaccordement }) =>
  async ({ identifiantProjet, référenceDossierRaccordement }) => {
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${formatIdentifiantProjet(
        identifiantProjet,
      )}#${référenceDossierRaccordement}`,
    );
    if (isNone(dossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    if (!dossierRaccordement.accuséRéception || !dossierRaccordement.accuséRéception?.format) {
      throw new FormatFichierInexistantError();
    }

    const fichier = await récupérerFichierDemandeComplèteRaccordement({
      identifiantProjet,
      référenceDossierRaccordement,
    });

    return {
      type: 'fichier-demander-complète-raccordement',
      format: extension(dossierRaccordement.accuséRéception.format),
      content: fichier,
    } as Readonly<TéléchargerFichierDemandeComplèteRaccordementReadModel>;
  };
