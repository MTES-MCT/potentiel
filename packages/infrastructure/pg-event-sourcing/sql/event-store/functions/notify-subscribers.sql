create or replace function event_store.notify_subscribers()
returns trigger as
$$
declare
  v_type varchar;
  v_subscriber event_store.subscriber;
begin
  v_type := new.type;

  select into v_subscriber
    subscriber_name
  from event_store.subscriber
  where (filter is null or v_type in (select jsonb_array_elements_text(filter))) and stream_category = split_part(new.stream_id, '|', 1)
  limit 1;

  if v_subscriber is null then
    insert into event_store.pending_acknowledgement
    values (split_part(new.stream_id, '|', 1), 'dead-letter-queue', new.stream_id, new.created_at, new.version);
  else
    for v_subscriber in
      select stream_category, subscriber_name
      from event_store.subscriber
      where (filter is null or v_type in (select jsonb_array_elements_text(filter))) and stream_category = split_part(new.stream_id, '|', 1)
    loop
      begin
        insert into event_store.pending_acknowledgement
        values (v_subscriber.stream_category, v_subscriber.subscriber_name, new.stream_id, new.created_at, new.version);
      exception
        when others then
          raise warning 'notify_subscribers: pending_acknowledgement insert failed for stream_id=%, type=%, subscriber=%, error=%',
            new.stream_id, new.type, v_subscriber.subscriber_name, sqlerrm;
      end;

      begin
        perform pg_notify(v_subscriber.stream_category || '|' || v_subscriber.subscriber_name, row_to_json(new)::text);
      exception
        when others then
          raise warning 'notify_subscribers: pg_notify failed for stream_id=%, type=%, subscriber=%, error=%',
            new.stream_id, new.type, v_subscriber.subscriber_name, sqlerrm;
      end;
    end loop;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists notify_subscribers_trigger on event_store.event_stream;
create trigger notify_subscribers_trigger
after insert on event_store.event_stream
for each row
execute function event_store.notify_subscribers();