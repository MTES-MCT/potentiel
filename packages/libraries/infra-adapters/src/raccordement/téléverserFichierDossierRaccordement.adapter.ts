import { upload } from '@potentiel/file-storage';
import { join } from 'path';
import { extension } from 'mime-types';
import {
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort,
  EnregistrerFichierPropositionTechniqueEtFinancièrePort,
} from '@potentiel/domain';

const téléverserFichierDossierRaccordementAdapter =
  (
    nomFichier: string,
  ): EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort &
    EnregistrerFichierPropositionTechniqueEtFinancièrePort =>
  async ({ content, format, identifiantProjet, référence }) => {
    const path = join(identifiantProjet, référence, `${nomFichier}.${extension(format)}`);
    await upload(path, content);
  };

export const téléverserAccuséRéceptionDemandeComplèteRaccordement: EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort =
  téléverserFichierDossierRaccordementAdapter('demande-complete-raccordement');
export const téléverserPropositionTechniqueEtFinancièreSignée: EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort =
  téléverserFichierDossierRaccordementAdapter('proposition-technique-et-financiere');
