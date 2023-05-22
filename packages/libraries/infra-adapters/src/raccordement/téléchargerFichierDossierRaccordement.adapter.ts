import {
  RécupérerAccuséRéceptionDemandeComplèteRaccordementPort,
  RécupérerPropositionTechniqueEtFinancièreSignéePort,
} from '@potentiel/domain';
import { download } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

const téléchargerFichierDossierRaccordementAdapter =
  (
    nomFichier: string,
  ): RécupérerAccuséRéceptionDemandeComplèteRaccordementPort &
    RécupérerPropositionTechniqueEtFinancièreSignéePort =>
  async ({ identifiantProjet, référenceDossierRaccordement: référence, format }) => {
    const filePath = join(identifiantProjet, référence, `${nomFichier}.${extension(format)}`);

    return await download(filePath);
  };

export const téléchargerAccuséRéceptionDemandeComplèteRaccordementAdapter: RécupérerAccuséRéceptionDemandeComplèteRaccordementPort =
  téléchargerFichierDossierRaccordementAdapter('demande-complete-raccordement');
export const téléchargerPropositionTechniqueEtFinancièreSignéeAdapter: RécupérerPropositionTechniqueEtFinancièreSignéePort =
  téléchargerFichierDossierRaccordementAdapter('proposition-technique-et-financiere');
