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
        return new;
      end;
      $$ language plpgsql;

    create or replace view system_views.stream_info as
      select
        split_part(es.stream_id, '|', 1) category,
        split_part(es.stream_id, '|', 2) id,
        min(es.created_at) created_at,
        max(es.created_at) updated_at,
        count(es.stream_id) event_count,
        count(pa.*) pending_acknowledgement_count,
        case
            when coalesce(max(pa.version), max(es.version)) < max(es.version) then 'inconsistent_after_next_retry' else 'ok' end as status
      from event_store.event_stream as es
      left outer join event_store.pending_acknowledgement as pa on pa.stream_id = es.stream_id and pa.created_at = es.created_at and pa.version = es.version
      group by
          category,
          id
      order by updated_at desc;
    `);
  },
};
