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
  async ({ identifiantProjet, référenceDossierRaccordement, format }) => {
    const filePath = join(
      identifiantProjet,
      référenceDossierRaccordement,
      `${nomFichier}.${extension(format)}`,
    );

    console.log(`Charger: ${filePath}`);

    return await download(filePath);
  };

export const téléchargerAccuséRéceptionDemandeComplèteRaccordementAdapter: RécupérerAccuséRéceptionDemandeComplèteRaccordementPort =
  téléchargerFichierDossierRaccordementAdapter('demande-complete-raccordement');
export const téléchargerPropositionTechniqueEtFinancièreSignéeAdapter: RécupérerPropositionTechniqueEtFinancièreSignéePort =
  téléchargerFichierDossierRaccordementAdapter('proposition-technique-et-financiere');
