import { deleteFile, getFiles, renameFile, upload } from '@potentiel/file-storage';
import { extname, join } from 'path';
import { extension } from 'mime-types';
import {
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort,
  EnregistrerPropositionTechniqueEtFinancièreSignéePort,
} from '@potentiel/domain';

type TéléverserFichierDossierRaccordementAdapter =
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort &
    EnregistrerPropositionTechniqueEtFinancièreSignéePort;

export const téléverserFichierDossierRaccordementAdapter: TéléverserFichierDossierRaccordementAdapter =
  async (options) => {
    if (options.opération === 'création' || options.opération === 'modification') {
      const { content, format } =
        options.type === 'demande-complete-raccordement'
          ? options.accuséRéception
          : options.propositionTechniqueEtFinancièreSignée;

      const { identifiantProjet, référenceDossierRaccordement, type } = options;

      await cleanFichiersDossierRaccordement(
        identifiantProjet,
        référenceDossierRaccordement,
        type,
        format,
      );

      const path = join(
        identifiantProjet,
        référenceDossierRaccordement,
        `${options.type}.${extension(format)}`,
      );

      await upload(path, content);
    } else {
      const pattern = join(
        options.identifiantProjet,
        options.référenceDossierRaccordementActuelle,
        `${options.type}`,
      );

      const filesToMove = await getFiles(pattern);

      for (const fileToMove of filesToMove) {
        const newPath = `${pattern}.${extname(fileToMove)}`;

        await renameFile(fileToMove, newPath);
      }
    }
  };
async function cleanFichiersDossierRaccordement(
  identifiantProjet: string,
  référenceDossierRaccordement: string,
  type: string,
  format: string,
) {
  const pattern = join(identifiantProjet, référenceDossierRaccordement, type);

  const filePaths = await getFiles(pattern);

  for (const filePath of filePaths) {
    if (extname(filePath) !== extension(format)) {
      await deleteFile(filePath);
    }
  }
}
