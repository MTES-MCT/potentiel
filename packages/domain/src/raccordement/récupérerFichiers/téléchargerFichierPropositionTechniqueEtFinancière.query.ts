import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { Find, QueryHandlerFactory } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  DossierRaccordementNonRéférencéError,
  FormatFichierInexistantError,
} from '../raccordement.errors';
import { DossierRaccordementReadModel } from '../consulter/dossierRaccordement.readModel';
import { RécupérerFichierPropositionTechniqueEtFinancière } from './récupérerFichierPropositionTechniqueEtFinancière';
import { TéléchargerFichierPropositionTechniqueEtFinancièreReadModel } from '../consulter/fichierPropositionTechniqueEtFinancière.readModel';

type TéléchargerFichierPropositionTechniqueEtFinancièreDependencies = {
  find: Find;
  récupérerFichierPropositionTechniqueEtFinancière: RécupérerFichierPropositionTechniqueEtFinancière;
};

export type TéléchargerFichierPropositionTechniqueEtFinancièreQuery = {
  identifiantProjet: IdentifiantProjet;
  référenceDossierRaccordement: string;
};

export const téléchargerFichierPropositionTechniqueEtFinancièreQueryHandlerFactory: QueryHandlerFactory<
  TéléchargerFichierPropositionTechniqueEtFinancièreQuery,
  TéléchargerFichierPropositionTechniqueEtFinancièreReadModel,
  TéléchargerFichierPropositionTechniqueEtFinancièreDependencies
> =
  ({ find, récupérerFichierPropositionTechniqueEtFinancière }) =>
  async ({ identifiantProjet, référenceDossierRaccordement }) => {
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${formatIdentifiantProjet(
        identifiantProjet,
      )}#${référenceDossierRaccordement}`,
    );
    if (isNone(dossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    if (
      !dossierRaccordement.propositionTechniqueEtFinancière ||
      !dossierRaccordement.propositionTechniqueEtFinancière.format ||
      dossierRaccordement.propositionTechniqueEtFinancière.format === 'none'
    ) {
      throw new FormatFichierInexistantError();
    }

    const fichier = await récupérerFichierPropositionTechniqueEtFinancière({
      identifiantProjet,
      référenceDossierRaccordement,
      format: dossierRaccordement.propositionTechniqueEtFinancière.format,
    });

    return {
      type: 'fichier-proposition-technique-et-financiere',
      format: dossierRaccordement.propositionTechniqueEtFinancière.format,
      content: fichier,
    } as Readonly<TéléchargerFichierPropositionTechniqueEtFinancièreReadModel>;
  };
