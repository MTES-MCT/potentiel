import { deleteFile, download, getFiles, upload } from '@potentiel/file-storage';
import { extname, join } from 'path';
import { DéplacerFichierPort } from '@potentiel/domain';

export const déplacerFichierAdapter: DéplacerFichierPort = async ({
  identifiantProjet,
  typeFichierActuel,
  nouveauType,
}) => {
  const actualFilePath = join(identifiantProjet, typeFichierActuel);
  const newPath = join(identifiantProjet, nouveauType);

  try {
    await deleteFile(newPath);
    const filesToMove = await getFiles(actualFilePath);
    const newFilePath = `${newPath}${extname(filesToMove[0])}`;
    const content = await download(filesToMove[0]);
    await upload(newFilePath, content);
    await deleteFile(filesToMove[0]);
  } catch (error) {
    return undefined;
  }
};
