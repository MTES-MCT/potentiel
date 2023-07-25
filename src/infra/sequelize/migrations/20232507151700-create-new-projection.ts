import { QueryInterface } from 'sequelize';
import { readFile } from 'fs/promises';
import { join } from 'path';

export default {
  up: async (queryInterface: QueryInterface) => {
    if (process.env.NODE_ENV !== 'production') {
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
          'projection.sql',
        ),
        'utf-8',
      );
      await queryInterface.sequelize.query(sql);
    }
  },
};
