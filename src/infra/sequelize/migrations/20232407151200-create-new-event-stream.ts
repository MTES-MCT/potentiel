import { QueryInterface } from 'sequelize';
import { readFile } from 'fs/promises';
import { join } from 'path';

export default {
  up: async (queryInterface: QueryInterface) => {
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
        'event-store.sql',
      ),
      'utf-8',
    );
    await queryInterface.sequelize.query(sql);

    if (process.env.NODE_ENV === 'test') {
      await queryInterface.sequelize.query(
        `drop rule prevent_delete_on_event_stream on event_store.event_stream`,
      );
    }
  },
};
