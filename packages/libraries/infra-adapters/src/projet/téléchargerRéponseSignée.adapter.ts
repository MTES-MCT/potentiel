import { RécupérerRéponseSignéeAbandonPort } from '@potentiel/domain-views';
import { download } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

export const téléchargerRéponseSignéeAdapter: RécupérerRéponseSignéeAbandonPort = async ({
  identifiantProjet,
  dateRécupérerRéponseSignée,
  format,
  type,
}) => {
  const filePath = join(
    identifiantProjet.formatter(),
    'abandon',
    type,
    `${dateRécupérerRéponseSignée.formatter()}.${extension(format)}`,
  );

  try {
    return await download(filePath);
  } catch (error) {
    return undefined;
  }
};
