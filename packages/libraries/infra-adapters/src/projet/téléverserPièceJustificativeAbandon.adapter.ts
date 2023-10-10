import { EnregistrerPièceJustificativeAbandonPort } from '@potentiel/domain/src/projet/lauréat/abandon/abandon.port';
import { upload } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

export const téléverserPièceJustificativeAbandonAdapter: EnregistrerPièceJustificativeAbandonPort =
  async ({
    identifiantProjet,
    pièceJustificative: { content, format },
    datePièceJustificativeAbandon,
  }) => {
    const filePath = join(
      identifiantProjet.formatter(),
      'abandon',
      'pièce-justificative',
      `${datePièceJustificativeAbandon.formatter()}.${extension(format)}`,
    );

    await upload(filePath, content);
  };
