import { upload } from '@potentiel/file-storage';
import {
  EnregistrerAccuséRéceptionDemandeComplèteRaccordement,
  formatIdentifiantProjet,
} from '@potentiel/domain';
import { join } from 'path';
import { extension } from 'mime-types';

export const enregistrerAccuséRéceptionDemandeComplèteRaccordement: EnregistrerAccuséRéceptionDemandeComplèteRaccordement =
  async ({ content, format, identifiantProjet, référenceDossierRaccordement }) => {
    const path = join(
      formatIdentifiantProjet(identifiantProjet),
      référenceDossierRaccordement,
      `demande-complete-raccordement.${extension(format)}`,
    );
    await upload(path, content);
  };
