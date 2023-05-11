import { upload } from '@potentiel/file-storage';
import { createReadStream } from 'fs';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordement } from '@potentiel/domain';

export const uploadFile: EnregistrerAccuséRéceptionDemandeComplèteRaccordement = async (path) => {
  await upload(path, createReadStream(path));
};
