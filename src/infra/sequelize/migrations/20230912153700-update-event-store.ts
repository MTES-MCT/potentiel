import { QueryInterface } from 'sequelize';
import { runSqlScript } from './newEventStore/runSqlScript';

export default {
  up: async ({ sequelize }: QueryInterface) => {
    await runSqlScript(sequelize);
  },
};
