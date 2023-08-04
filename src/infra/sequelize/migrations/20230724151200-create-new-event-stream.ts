import { QueryInterface } from 'sequelize';
import { readFile } from 'fs/promises';
import { join } from 'path';

export default {
  up: async (queryInterface: QueryInterface) => {
    await executeScript(queryInterface, 'event-store.sql');
    await executeScript(queryInterface, 'system.sql');

    if (process.env.NODE_ENV === 'test') {
      await queryInterface.sequelize.query(
        `drop rule prevent_delete_on_event_stream on event_store.event_stream`,
      );
    }
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
      'pg-event-sourcing',
      'sql',
      scriptName,
    ),
    'utf-8',
  );
  await queryInterface.sequelize.query(sql);
}
