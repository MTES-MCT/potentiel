import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(`
      create or replace function event_store.notify_subscribers()
      returns trigger as
      $$
      declare
      begin
        perform pg_notify('new_event', row_to_json(NEW)::text);

        return new;
      end;
      $$ language plpgsql;
    `);
  },
};
