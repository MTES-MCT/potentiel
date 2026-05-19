import { getLogger } from '@potentiel-libraries/monitoring';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

class CopyFailedError extends Error {
  constructor({ cause }: { cause?: Error } = {}) {
    super(`La copie du fichier a échoué`, { cause });
  }
}

export const copyFile = async (sourceKey: string, targetKey: string) => {
  try {
    const { rowCount } = await executeQuery(
      `insert into document_store.files (key, content) 
      select $1, content from document_store.files where key = $2`,
      targetKey,
      sourceKey,
    );
    if (rowCount === 0) {
      throw new Error(`Fichier source non trouvé`);
    }
  } catch (e) {
    getLogger().warn('Copy failed', { error: e, sourceKey, targetKey });
    throw new CopyFailedError({ cause: e instanceof Error ? e : undefined });
  }
};
