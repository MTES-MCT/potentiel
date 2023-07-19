-- Event Store
create schema event_store;

create table event_store.event_stream (
  stream_id varchar not null,
  created_at varchar not null,
  type varchar not null,
  version integer not null,
  payload jsonb,
  primary key (stream_id, created_at, version)
);

create index on event_store.event_stream (stream_id);

create function event_store.notify_new_event() returns trigger as
$trigger$
  begin
    perform pg_notify('new_event', row_to_json(new)::text);
    return new;
  end;
$trigger$
  language plpgsql volatile
  cost 100;

create trigger notify_new_event
after insert
on event_store.event_stream
for each row
execute procedure event_store.notify_new_event();

create function event_store.throw_when_trying_to_update_event() returns void as
$$
  begin
    raise exception 'Event are immutable and can not be updated';
  end;
$$ language plpgsql volatile;

create function event_store.throw_when_trying_to_delete_event() returns void as
$$
  begin
    raise exception 'Event are immutable and can not be deleted';
  end;
$$ language plpgsql volatile;

create rule prevent_delete_on_event_stream as on delete to event_store.event_stream do instead select event_store.throw_when_trying_to_delete_event();
create rule prevent_update_on_event_stream as on update to event_store.event_stream do instead select event_store.throw_when_trying_to_update_event();

-- Replication
CREATE OR REPLACE FUNCTION notify_new_event() RETURNS TRIGGER AS
$trigger$
  BEGIN
      PERFORM pg_notify('new_event', row_to_json(NEW)::text);
      RETURN NEW; -- modification du trigger pour retourner new
  END;
$trigger$
  LANGUAGE plpgsql VOLATILE
  COST 100;

create function insert_into_event_store()
    returns trigger as
$trigger$
    begin
        insert into event_store.event_stream (stream_id, created_at, type, version, payload) values (split_part(new."streamId", '#', 1) || '|' || split_part(new."streamId", split_part(new."streamId", '#', 1) || '#', 2), new."createdAt", new."type", new."version", new."payload");
        return new;
    end;
$trigger$
language plpgsql volatile;

create trigger insert_into_event_store_trigger
after insert
on "EVENT_STREAM"
for each row
execute procedure insert_into_event_store();

-- System projections
create schema system_projections;

create view system_projections.stream_info as
    select
        split_part(event_stream.stream_id, '|', 1) category,
        split_part(event_stream.stream_id, '|', 2) id,
        min(event_stream.created_at) created_at,
        max(event_stream.created_at) updated_at,
        count(event_stream.stream_id) event_count
    from event_store.event_stream
    group by
        category,
        id
    order by updated_at desc;

create view system_projections.stream_category as
    select category, count(id) from system_projections.stream_info group by category order by category;

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
                where stream_id = p_category || '|' || p_id limit 1
            ),
            '{}'
        );
    else
      insert into event_store.event_stream
      select p_category || '|' || si.id, left(trim(both '"' from to_json(now())::text), 23) || 'Z', 'RebuildTriggered', coalesce(max(es.version), 0) + 1, '{}'
      from system_projections.stream_info si
      left join event_store.event_stream es on (p_category || '|' || si.id) = es.stream_id
      where si.category = p_category
      group by si.id;
    end if;
  end
$$ language plpgsql;

-- insert into event_store.event_stream(stream_id, created_at, type, version, payload)
-- select split_part("streamId", '#', 1) || '|' || split_part("streamId", split_part("streamId", '#', 1) || '#', 2), "createdAt", "type", "version", "payload" from "EVENT_STREAM";