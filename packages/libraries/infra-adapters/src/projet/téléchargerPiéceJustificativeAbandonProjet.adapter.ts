import { RécupérerPiéceJustificativeAbandonProjetPort } from '@potentiel/domain-views';
import { download } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

export const téléchargerPiéceJustificativeAbandonProjetAdapter: RécupérerPiéceJustificativeAbandonProjetPort =
  async ({ identifiantProjet, datePiéceJustificativeAbandon, format }) => {
    const filePath = join(
      identifiantProjet.formatter(),
      'abandon',
      'piéce-justificative',
      `${datePiéceJustificativeAbandon.formatter()}.${extension(format)}`,
    );

    try {
      return await download(filePath);
    } catch (error) {
      return undefined;
    }
  };
