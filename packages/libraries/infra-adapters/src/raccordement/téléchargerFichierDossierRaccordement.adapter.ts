import {
  RécupérerAccuséRéceptionDemandeComplèteRaccordementPort,
  RécupérerFichierPropositionTechniqueEtFinancièrePort,
} from '@potentiel/domain';
import { download } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

const téléchargerFichierDossierRaccordementAdapter =
  (
    nomFichier: string,
  ): RécupérerAccuséRéceptionDemandeComplèteRaccordementPort &
    RécupérerFichierPropositionTechniqueEtFinancièrePort =>
  async ({ identifiantProjet, référence, format }) => {
    const filePath = join(identifiantProjet, référence, `${nomFichier}.${extension(format)}`);

    return await download(filePath);
  };

export const téléchargerAccuséRéceptionDemandeComplèteRaccordement: RécupérerAccuséRéceptionDemandeComplèteRaccordementPort =
  téléchargerFichierDossierRaccordementAdapter('demande-complete-raccordement');
export const téléchargerPropositionTechniqueEtFinancièreSignée: RécupérerFichierPropositionTechniqueEtFinancièrePort =
  téléchargerFichierDossierRaccordementAdapter('proposition-technique-et-financiere');
