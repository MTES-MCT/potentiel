import {
  RenommerPropositionTechniqueEtFinancière,
  formatIdentifiantProjet,
} from '@potentiel/domain';
import { renameFile } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

export const renommerPropositionTechniqueEtFinancière: RenommerPropositionTechniqueEtFinancière =
  async ({ ancienneRéférence, nouvelleRéférence, identifiantProjet, formatAncienFichier }) => {
    await renameFile(
      join(
        formatIdentifiantProjet(identifiantProjet),
        ancienneRéférence,
        `proposition-technique-et-financiere.${extension(formatAncienFichier)}`,
      ),
      join(
        formatIdentifiantProjet(identifiantProjet),
        nouvelleRéférence,
        `proposition-technique-et-financiere`,
        // TODO : ajouter extension
      ),
    );
  };
