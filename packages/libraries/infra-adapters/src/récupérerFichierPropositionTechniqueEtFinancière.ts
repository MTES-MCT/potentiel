import {
  RécupérerFichierPropositionTechniqueEtFinancière,
  formatIdentifiantProjet,
} from '@potentiel/domain';
import { download } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

export const récupérerFichierPropositionTechniqueEtFinancière: RécupérerFichierPropositionTechniqueEtFinancière =
  async ({ identifiantProjet, référenceDossierRaccordement, format }) => {
    const filePath = join(
      formatIdentifiantProjet(identifiantProjet),
      référenceDossierRaccordement,
      `proposition-technique-et-financiere.${extension(format)}`,
    );
    return await download(filePath);
  };
