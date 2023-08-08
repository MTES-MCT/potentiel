import { QueryInterface } from 'sequelize';
import { readFile } from 'fs/promises';
import { join } from 'path';

export default {
  up: async (queryInterface: QueryInterface) => {
    await executeScript(queryInterface, 'app.sql');
    await executeScript(queryInterface, 'analytic.sql');
  },
};
async function executeScript(queryInterface: QueryInterface, scriptName: string) {
  const sql = await readFile(
    join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'packages',
      'libraries',
      'pg-projections',
      'sql',
      scriptName,
    ),
    'utf-8',
  );
  await queryInterface.sequelize.query(sql);
}
