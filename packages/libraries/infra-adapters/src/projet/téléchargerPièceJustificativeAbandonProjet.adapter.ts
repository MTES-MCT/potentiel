import { RécupérerPièceJustificativeAbandonPort } from '@potentiel/domain-views';
import { download } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

export const téléchargerPièceJustificativeAbandonProjetAdapter: RécupérerPièceJustificativeAbandonPort =
  async ({ identifiantProjet, datePièceJustificativeAbandon, format }) => {
    const filePath = join(
      identifiantProjet.formatter(),
      'abandon',
      'pièce-justificative',
      `${datePièceJustificativeAbandon.formatter()}.${extension(format)}`,
    );

    try {
      return await download(filePath);
    } catch (error) {
      return undefined;
    }
  };
