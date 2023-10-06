import { EnregistrerPiéceJustificativeAbandonPort } from '@potentiel/domain/src/projet/lauréat/abandon/abandon.port';
import { upload } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

export const téléverserPiéceJustificativeAbandonAdapter: EnregistrerPiéceJustificativeAbandonPort =
  async ({
    identifiantProjet,
    piéceJustificative: { content, format },
    datePiéceJustificativeAbandon,
  }) => {
    const filePath = join(
      identifiantProjet.formatter(),
      'abandon',
      'piéce-justificative',
      `${datePiéceJustificativeAbandon.formatter()}.${extension(format)}`,
    );

    await upload(filePath, content);
  };
