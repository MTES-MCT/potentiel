import { upload } from '@potentiel/file-storage';
import { join } from 'path';
import { extension } from 'mime-types';
import {
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort,
  EnregistrerPropositionTechniqueEtFinancièreSignéePort,
} from '@potentiel/domain';

const téléverserFichierDossierRaccordementAdapter =
  (
    nomFichier: string,
  ): EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort &
    EnregistrerPropositionTechniqueEtFinancièreSignéePort =>
  async ({ content, format, identifiantProjet, référenceDossierRaccordement: référence }) => {
    const path = join(identifiantProjet, référence, `${nomFichier}.${extension(format)}`);
    await upload(path, content);
  };

export const téléverserAccuséRéceptionDemandeComplèteRaccordementAdapter: EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort =
  téléverserFichierDossierRaccordementAdapter('demande-complete-raccordement');
export const téléverserPropositionTechniqueEtFinancièreSignéeAdapter: EnregistrerPropositionTechniqueEtFinancièreSignéePort =
  téléverserFichierDossierRaccordementAdapter('proposition-technique-et-financiere');
