import {
  RécupérerFichierDemandeComplèteRaccordement,
  formatIdentifiantProjet,
} from '@potentiel/domain';
import { download } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

export const récupérerFichierDemandeComplèteRaccordement: RécupérerFichierDemandeComplèteRaccordement =
  async ({ identifiantProjet, référenceDossierRaccordement, format }) => {
    const filePath = join(
      formatIdentifiantProjet(identifiantProjet),
      référenceDossierRaccordement,
      `demande-complete-raccordement.${extension(format)}`,
    );

    return await download(filePath);
  };
