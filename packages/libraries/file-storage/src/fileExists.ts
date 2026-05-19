import { executeSelect } from '@potentiel-libraries/pg-helpers';

export const fileExists = async (filePath: string) => {
  const [{ count }] = await executeSelect<{ count: number }>(
    `SELECT COUNT(*) as count FROM files WHERE path = $1`,
    [filePath],
  );
  return count > 0;
};
