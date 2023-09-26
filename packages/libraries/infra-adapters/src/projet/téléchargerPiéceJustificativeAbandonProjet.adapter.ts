import { RécupérerPiéceJustificativeAbandonProjetPort } from '@potentiel/domain-views';
import { download } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

export const téléchargerPiéceJustificativeAbandonProjetAdapter: RécupérerPiéceJustificativeAbandonProjetPort =
  async (identifiantProjet, format) => {
    const filePath = join(identifiantProjet, `$piéce-justificative-abandon.${extension(format)}`);

    try {
      return await download(filePath);
    } catch (error) {
      return undefined;
    }
  };
