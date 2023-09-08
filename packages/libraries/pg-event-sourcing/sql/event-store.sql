-- Event Store
create schema event_store;

create table event_store.event_stream (
  stream_id varchar not null,
  created_at varchar not null,
  type varchar not null,
  version integer not null,
  payload jsonb not null,
  primary key (stream_id, created_at, version)
);

create index on event_store.event_stream (stream_id);

insert into event_store.event_stream(stream_id, created_at, type, version, payload)
select split_part("streamId", '#', 1) || '|' || split_part("streamId", split_part("streamId", '#', 1) || '#', 2), "createdAt", "type", "version", "payload" from "EVENT_STREAM";

create table event_store.subscriber (
  subscriber_id varchar not null primary key,
  filter jsonb default null
);

create table event_store.pending_acknowledgement (
  subscriber_id varchar not null,
  stream_id varchar not null,
  created_at varchar not null,
  version integer not null,
  primary key (subscriber_id, stream_id, created_at, version)
);

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
    subscriber_id
  from event_store.subscriber
  where (filter is null or v_type in (select jsonb_array_elements_text(filter))) and split_part(subscriber_id, '|', 1) = split_part(new.stream_id, '|', 1)
  limit 1;

  if v_subscriber is null then
    insert into event_store.pending_acknowledgement
    values ('dead_letter_queue', new.stream_id, new.created_at, new.version);
  else
    for v_subscriber in
      select subscriber_id
      from event_store.subscriber
      where (filter is null or v_type in (select jsonb_array_elements_text(filter))) and split_part(subscriber_id, '|', 1) = split_part(new.stream_id, '|', 1)
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


-- créer le déclencheur sur la table event_store.event_stream
create trigger notify_subscribers_trigger
after insert on event_store.event_stream
for each row
execute function event_store.notify_subscribers();

create function event_store.throw_when_trying_to_update_event() returns void as
$$
  begin
    raise exception 'Event are immutable and can not be updated';
  end;
$$ language plpgsql;

create function event_store.throw_when_trying_to_delete_event() returns void as
$$
  begin
    raise exception 'Event are immutable and can not be deleted';
  end;
$$ language plpgsql;

create rule prevent_delete_on_event_stream as on delete to event_store.event_stream do instead select event_store.throw_when_trying_to_delete_event();
create rule prevent_update_on_event_stream as on update to event_store.event_stream do instead select event_store.throw_when_trying_to_update_event();

-- Replication
create or replace function notify_new_event() returns trigger as
$$
  begin
      perform pg_notify('new_event', row_to_json(NEW)::text);
      return new;
  end;
$$ language plpgsql;

-- Rebuild
create procedure event_store.rebuild(
  p_category varchar,
  p_id varchar default null
)
as
$$
  begin
    if p_id is not null then
        insert into event_store.event_stream
        values (
            p_category || '|' || p_id,
            left(trim(both '"' from to_json(now())::text), 23) || 'Z',
            'RebuildTriggered',
            (
                select coalesce(version, 0) + 1
                from event_store.event_stream
                where stream_id = p_category || '|' || p_id
                order by version desc
                limit 1
            ),
            json_build_object('category', p_category, 'id', p_id)
        );
    else
      insert into event_store.event_stream
      select p_category || '|' || si.id, left(trim(both '"' from to_json(now())::text), 23) || 'Z', 'RebuildTriggered', coalesce(max(es.version), 0) + 1, json_build_object('category', p_category, 'id', si.id)
      from system_views.stream_info si
      left join event_store.event_stream es on (p_category || '|' || si.id) = es.stream_id
      where si.category = p_category
      group by si.id;
    end if;
  end
$$ language plpgsql;
