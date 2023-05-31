import { renameFile, upload } from '@potentiel/file-storage';
import { join } from 'path';
import { extension } from 'mime-types';
import {
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort,
  EnregistrerPropositionTechniqueEtFinancièreSignéePort,
} from '@potentiel/domain';

const téléverserFichierDossierRaccordementAdapter =
  (nomFichier: string): EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort =>
  async (params) => {
    if (params.opération === 'création') {
      const {
        identifiantProjet,
        référenceDossierRaccordement,
        nouveauFichier: { content, format },
      } = params;

      const path = join(
        identifiantProjet,
        référenceDossierRaccordement,
        `${nomFichier}.${extension(format)}`,
      );
      await upload(path, content);
    }

    if (params.opération === 'modification') {
      const {
        identifiantProjet,
        ancienneRéférenceDossierRaccordement,
        nouvelleRéférenceDossierRaccordement,
        ancienFichier,
        nouveauFichier,
      } = params;

      const filetoDeletePath = join(
        identifiantProjet,
        ancienneRéférenceDossierRaccordement,
        `${nomFichier}.${extension(ancienFichier.format)}`,
      );

      const fileToAddPath = join(
        identifiantProjet,
        nouvelleRéférenceDossierRaccordement,
        `${nomFichier}.${extension(nouveauFichier.format)}`,
      );

      await upload(filetoDeletePath, nouveauFichier.content);
      if (filetoDeletePath !== fileToAddPath) {
        await renameFile(filetoDeletePath, fileToAddPath);
      }
    }
  };

export const téléverserAccuséRéceptionDemandeComplèteRaccordementAdapter: EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort =
  téléverserFichierDossierRaccordementAdapter('demande-complete-raccordement');
export const téléverserPropositionTechniqueEtFinancièreSignéeAdapter: EnregistrerPropositionTechniqueEtFinancièreSignéePort =
  téléverserFichierDossierRaccordementAdapter('proposition-technique-et-financiere');
