import { EnregistrerRéponseSignéePort } from '@potentiel/domain-usecases';
import { upload } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

export const téléverserRéponseSignéeAdapter: EnregistrerRéponseSignéePort = async ({
  identifiantProjet,
  réponseSignée: { content, format, type },
  dateDocumentRéponseSignée,
}) => {
  const filePath = join(
    identifiantProjet.formatter(),
    'abandon',
    type,
    `${dateDocumentRéponseSignée.formatter()}.${extension(format)}`,
  );

  await upload(filePath, content);
};
