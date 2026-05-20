import { executeSelect } from '@potentiel-libraries/pg-helpers';

export const fileExists = async (filePath: string) => {
  const [{ count }] = await executeSelect<{ count: number }>(
    `SELECT COUNT(*) as count FROM document_store.files WHERE key = $1`,
    filePath,
  );
  return count > 0;
};
