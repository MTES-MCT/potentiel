import { deleteFile, getFiles, upload } from '@potentiel/file-storage';
import { join } from 'path';
import { extension } from 'mime-types';
import { TéléverserFichierPort } from '@potentiel/domain';

export const téléverserFichierAdapter: TéléverserFichierPort = async ({
  identifiantProjet,
  type,
  content,
  format,
}) => {
  await supprimerFichierActuel(identifiantProjet, type);

  const path = join(identifiantProjet, `${type}.${extension(format)}`);

  await upload(path, content);
};

async function supprimerFichierActuel(identifiantProjet: string, type: string) {
  const filePaths = await getFiles(join(identifiantProjet, type));
  if (!filePaths.length) {
    return;
  }

  for (const filePath of filePaths) {
    await deleteFile(filePath);
  }
}
