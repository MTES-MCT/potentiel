import { RemplacerAccuséRéceptionDemandeComplèteRaccordement } from '@potentiel/domain';
import { deleteFile, getFiles } from '@potentiel/file-storage';
import { enregistrerAccuséRéceptionDemandeComplèteRaccordement } from './enregistrerAccuséRéceptionDemandeComplèteRaccordement';

type ReplaceFile = RemplacerAccuséRéceptionDemandeComplèteRaccordement;

export const replaceFile: ReplaceFile = async ({
  fichierASupprimerPath,
  nouveauFichier: { path, content },
}) => {
  const files = await getFiles(fichierASupprimerPath);

  if (files.length > 0) {
    await deleteFile(files[0]);
  }

  await enregistrerAccuséRéceptionDemandeComplèteRaccordement(path, content);
};
