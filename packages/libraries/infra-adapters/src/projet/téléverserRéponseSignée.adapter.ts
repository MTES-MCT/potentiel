import { EnregistrerRéponseSignéePort } from '@potentiel/domain';
import { upload } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

export const téléverserRéponseSignéeAdapter: EnregistrerRéponseSignéePort = async ({
  identifiantProjet,
  réponseSignée: { content, format, type },
}) => {
  const filePath = join(identifiantProjet, `${type}.${extension(format)}`);

  await upload(filePath, content);
};
