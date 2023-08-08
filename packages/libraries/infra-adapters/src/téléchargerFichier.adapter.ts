import { download } from '@potentiel/file-storage';
import { join } from 'path';
import { extension } from 'mime-types';
import { TéléchargerFichierPort } from '@potentiel/domain-views';

export const téléchargerFichierAdapter: TéléchargerFichierPort = async ({
  identifiantProjet,
  type,
  format,
}) => {
  const filePath = join(identifiantProjet, `${type}.${extension(format)}`);

  try {
    return await download(filePath);
  } catch (error) {
    return undefined;
  }
};
