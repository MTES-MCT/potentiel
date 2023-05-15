import {
  RemplacerAccuséRéceptionDemandeComplèteRaccordement,
  formatIdentifiantProjet,
} from '@potentiel/domain';
import { deleteFile, getFiles } from '@potentiel/file-storage';
import { enregistrerAccuséRéceptionDemandeComplèteRaccordement } from './enregistrerAccuséRéceptionDemandeComplèteRaccordement';
import { join } from 'path';

export const remplacerAccuséRéceptionDemandeComplèteRaccordement: RemplacerAccuséRéceptionDemandeComplèteRaccordement =
  async ({
    ancienneRéférence,
    nouvelleRéférence,
    identifiantProjet,
    nouveauFichier: { format, content },
  }) => {
    const fichierASupprimerPath = join(
      formatIdentifiantProjet(identifiantProjet),
      ancienneRéférence,
      `demande-complete-raccordement`,
    );
    const files = await getFiles(fichierASupprimerPath);

    if (files.length > 0) {
      await deleteFile(files[0]);
    }

    await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
      identifiantProjet,
      référenceDossierRaccordement: nouvelleRéférence,
      format,
      content,
    });
  };
