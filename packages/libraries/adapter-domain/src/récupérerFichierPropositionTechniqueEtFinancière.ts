import {
  RécupérerFichierPropositionTechniqueEtFinancière,
  formatIdentifiantProjet,
} from '@potentiel/domain';
import { getFiles, download } from '@potentiel/file-storage';
import { join } from 'path';

export const récupérerFichierPropositionTechniqueEtFinancière: RécupérerFichierPropositionTechniqueEtFinancière =
  async ({ identifiantProjet, référenceDossierRaccordement }) => {
    const filePath = join(
      formatIdentifiantProjet(identifiantProjet),
      référenceDossierRaccordement,
      `proposition-technique-et-financiere`,
    );
    const files = await getFiles(filePath);

    if (files.length === 0) {
      new Error();
      // TODO : créer nouvelle erreur
    }

    const fileContent = await download(files[0]);

    return fileContent;
  };
