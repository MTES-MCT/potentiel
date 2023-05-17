import { upload } from '@potentiel/file-storage';
import {
  EnregistrerFichierPropositionTechniqueEtFinancière,
  formatIdentifiantProjet,
} from '@potentiel/domain';
import { join } from 'path';
import { extension } from 'mime-types';

export const enregistrerFichierPropositionTechniqueEtFinancière: EnregistrerFichierPropositionTechniqueEtFinancière =
  async ({ content, format, identifiantProjet, référenceDossierRaccordement }) => {
    const path = join(
      formatIdentifiantProjet(identifiantProjet),
      référenceDossierRaccordement,
      `proposition-technique-et-financiere.${extension(format)}`,
    );
    await upload(path, content);
  };
