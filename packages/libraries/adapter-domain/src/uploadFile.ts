import { upload } from '@potentiel/file-storage';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordement } from '@potentiel/domain';

type UploadFile = EnregistrerAccuséRéceptionDemandeComplèteRaccordement;

export const uploadFile: UploadFile = async (path, content) => await upload(path, content);
