import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(`      
      create or replace function event_store.notify_subscribers()
      returns trigger as
      $$
      declare
        v_type varchar;
        v_subscriber event_store.subscriber;
        v_error_msg jsonb;
      begin
        v_type := new.type;

        select into v_subscriber
          "subscriber_id"
        from event_store."subscriber"
        where "filter" is not null and v_type in (select jsonb_array_elements_text(filter))
        limit 1;

        if v_subscriber is null then
          insert into event_store.pending_acknowledgement
          values ('dead-letter-queue', new.stream_id, new.created_at, new.version);
        else
          for v_subscriber in
            select subscriber_id
            from event_store.subscriber
            where filter is null or v_type in (select jsonb_array_elements_text(filter))
          loop
            begin
              insert into event_store.pending_acknowledgement
              values (v_subscriber.subscriber_id, new.stream_id, new.created_at, new.version);

              perform pg_notify(v_subscriber.subscriber_id, row_to_json(new)::text);
            exception
              when others then
                v_error_msg := json_build_object('error_message', sqlerrm);

                perform pg_notify('error_notifications', v_error_msg::text);
            end;
          end loop;
        end if;
        return new;
      end;
      $$ language plpgsql;
    `);
  },
};
