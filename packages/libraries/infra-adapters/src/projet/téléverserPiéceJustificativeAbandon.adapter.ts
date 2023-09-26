import { EnregistrerPiéceJustificativeAbandonPort } from '@potentiel/domain/src/projet/lauréat/abandon/abandon.port';
import { upload } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

export const téléverserPiéceJustificativeAbandonAdapter: EnregistrerPiéceJustificativeAbandonPort =
  async ({ identifiantProjet, piéceJustificative: { content, format } }) => {
    const filePath = join(identifiantProjet, `piéce-justificative-abandon.${extension(format)}`);

    await upload(filePath, content);
  };
