import { upload } from '@potentiel/file-storage';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordement } from '@potentiel/domain';

export const uploadFile: EnregistrerAccuséRéceptionDemandeComplèteRaccordement = async (
  path,
  content,
) => {
  await upload(path, content);
};
