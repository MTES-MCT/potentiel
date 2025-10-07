create or replace function event_store.notify_subscribers() returns trigger as $$
declare v_type varchar;
v_subscriber event_store.subscriber;
v_error_msg jsonb;
begin v_type := new.type;

select into v_subscriber subscriber_name
from event_store.subscriber
where (
    filter is null
    or v_type in (
      select jsonb_array_elements_text(filter)
    )
  )
  and stream_category = split_part(new.stream_id, '|', 1)
limit 1;

  if v_subscriber is null then
insert into event_store.pending_acknowledgement
values (
    split_part(new.stream_id, '|', 1),
    'dead-letter-queue',
    new.stream_id,
    new.created_at,
    new.version
  );
else for v_subscriber in
select stream_category,
  subscriber_name
from event_store.subscriber
where (
    filter is null
    or v_type in (
      select jsonb_array_elements_text(filter)
    )
  )
  and stream_category = split_part(new.stream_id, '|', 1) loop begin
insert into event_store.pending_acknowledgement
values (
    v_subscriber.stream_category,
    v_subscriber.subscriber_name,
    new.stream_id,
    new.created_at,
    new.version
  );

        perform graphile_worker.add_job(
  v_subscriber.stream_category || '|' || v_subscriber.subscriber_name,
  row_to_json(new)
);
exception
when others then v_error_msg := json_build_object('error_message', sqlerrm);

-- TODO
perform graphile_worker.add_job('error_notifications', v_error_msg);
end;
end loop;
end if;
return new;
end;
$$ language plpgsql;

drop trigger if exists notify_subscribers_trigger on event_store.event_stream;
create trigger notify_subscribers_trigger
after
insert on event_store.event_stream for each row execute function event_store.notify_subscribers();