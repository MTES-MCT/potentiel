import { deleteFile } from '@potentiel/file-storage';
import { join } from 'path';
import { SupprimerFichierPort } from '@potentiel/domain';

export const supprimerFichierAdapter: SupprimerFichierPort = async ({
  identifiantProjet,
  type,
}) => {
  const filePath = join(identifiantProjet, type);

  try {
    await deleteFile(filePath);
  } catch (error) {
    return undefined;
  }
};
