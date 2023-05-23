import {
  SupprimerAccuséRéceptionDemandeComplèteRaccordementPort,
  SupprimerPropositionTechniqueEtFinancièreSignéePort,
} from '@potentiel/domain';
import { deleteFile } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

const supprimerFichierDossierRaccordementAdapter =
  (nomFichier: string): SupprimerAccuséRéceptionDemandeComplèteRaccordementPort =>
  async ({ format, identifiantProjet, référenceDossierRaccordement }) => {
    const filePath = join(
      identifiantProjet,
      référenceDossierRaccordement,
      `${nomFichier}.${extension(format)}`,
    );
    await deleteFile(filePath);
  };

export const supprimerAccuséRéceptionDemandeComplèteRaccordementAdapter: SupprimerAccuséRéceptionDemandeComplèteRaccordementPort =
  supprimerFichierDossierRaccordementAdapter('demande-complete-raccordement');
export const supprimerPropositionTechniqueEtFinancièreSignéeAdapter: SupprimerPropositionTechniqueEtFinancièreSignéePort =
  supprimerFichierDossierRaccordementAdapter('proposition-technique-et-financiere');
