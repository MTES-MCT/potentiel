import {
  RenommerPropositionTechniqueEtFinancière,
  formatIdentifiantProjet,
} from '@potentiel/domain';
import { getFiles, renameFile } from '@potentiel/file-storage';
import { extname, join } from 'path';

export const renommerPropositionTechniqueEtFinancière: RenommerPropositionTechniqueEtFinancière =
  async ({ ancienneRéférence, nouvelleRéférence, identifiantProjet }) => {
    const fichierPTF = await getFiles(
      join(
        formatIdentifiantProjet(identifiantProjet),
        ancienneRéférence,
        `proposition-technique-et-financiere`,
      ),
    );

    if (fichierPTF.length > 0) {
      await renameFile(
        fichierPTF[0],
        join(
          formatIdentifiantProjet(identifiantProjet),
          nouvelleRéférence,
          `proposition-technique-et-financiere${extname(fichierPTF[0])}`,
        ),
      );
    }
  };
