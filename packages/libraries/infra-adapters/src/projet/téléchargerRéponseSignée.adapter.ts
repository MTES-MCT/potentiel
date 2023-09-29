import {
  RécupérerRéponseSignée,
} from '@potentiel/domain-views';
import { download } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

export const téléchargerRéponseSignéeAdapter: RécupérerRéponseSignée = async (
  identifiantProjet,
  format,
  type,
) => {
  const filePath = join(identifiantProjet, `${type}.${extension(format)}`);

  try {
    return await download(filePath);
  } catch (error) {
    return undefined;
  }
};
